import type { GetUserByIdDto } from '@/domain/dtos'
import type { UserEntity } from '@/domain/entities'
import type { UsersRepository } from '@/domain/repositories'
import { CustomError } from '@/domain/errors'

export interface GetUserByIdResponseDto {
  success: boolean
  data: UserEntity
}

export class GetUserByIdUseCase {
  constructor (
    private readonly usersRepository: UsersRepository
  ) {}
  async execute ( getUserByIdDto: GetUserByIdDto ): Promise<GetUserByIdResponseDto> {
    const user = await this.usersRepository.getUserById( getUserByIdDto )
    if ( !user ) {
      throw CustomError.notFound( 'errors.getUserById.user.notFound' )
    }
    return { success: true, data: user }
  }
}