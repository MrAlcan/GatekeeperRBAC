import type { DeleteUserDto } from '@/domain/dtos'
import type { UsersRepository } from '@/domain/repositories'
import { CustomError } from '@/domain/errors'

export interface DeleteUserResponseDto {
  success: boolean
}

export class DeleteUserUseCase {
  constructor (
    private readonly usersRepository: UsersRepository
  ) {}
  async execute ( deleteUserDto: DeleteUserDto ): Promise<DeleteUserResponseDto> {
    await this.usersRepository.deleteUser( deleteUserDto )
    return { success: true }
  }
}