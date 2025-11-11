import type { UsersRepository } from '@/domain/repositories'
import type { GetUserByIdInput } from '@/domain/schemas'
import type { GetUserByIdResponseDTO } from '@/application/dtos'
import { EntityIdVO } from '@/domain/value-objects'
import { NotFoundError } from '@/domain/errors'
import { UserMapper } from '@/application/mappers'

export class GetUserByIdUseCase {
  constructor(
    private readonly usersRepository: UsersRepository
  ) {}

  async execute( input: GetUserByIdInput ): Promise<GetUserByIdResponseDTO> {
    const userIdVO = EntityIdVO.create( input.id )

    const user = await this.usersRepository.findById( userIdVO )
    if ( !user ) {
      throw NotFoundError.user( input.id )
    }

    return {
      success: true,
      data: UserMapper.toDTO( user )
    }
  }
}