import type { CreateUserDto } from '@/domain/dtos'
import type { UserEntity } from '@/domain/entities'
import type { UsersRepository } from '@/domain/repositories'
import { CustomError } from '@/domain/errors'

export interface CreateUserResponseDto {
  success: boolean
  data: UserEntity
}

export class CreateUserUseCase {
  constructor (
    private readonly usersRepository: UsersRepository
  ) {}
  async execute ( createUserDto: CreateUserDto ): Promise<CreateUserResponseDto> {
    const user = await this.usersRepository.createUser( createUserDto )
    if ( !user ) {
      throw CustomError.notFound( 'errors.createUser.user.notFound' )
    }
    return { success: true, data: user }
  }
}
