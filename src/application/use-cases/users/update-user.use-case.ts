import type { UpdateUserDto } from '@/domain/dtos'
import type { UserEntity } from '@/domain/entities'
import type { UsersRepository } from '@/domain/repositories'
import { CustomError } from '@/domain/errors'

export interface UpdateUserResponseDto {
  success: boolean
  data: UserEntity
}

export class UpdateUserUseCase {
  constructor (
    private readonly usersRepository: UsersRepository
  ) {}
  async execute ( updateUserDto: UpdateUserDto ): Promise<UpdateUserResponseDto> {
    const user = await this.usersRepository.updateUser( updateUserDto )
    if ( !user ) {
      throw CustomError.notFound( 'errors.updateUser.user.notFound' )
    }
    return { success: true, data: user }
  }
}