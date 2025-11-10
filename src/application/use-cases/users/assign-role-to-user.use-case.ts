import type { AssignRoleToUserDto } from '@/domain/dtos'
import type { UsersRepository } from '@/domain/repositories'

export interface AssignRoleToUserResponseDto {
  success: boolean
}

export class AssignRoleToUserUseCase {
  constructor (
    private readonly usersRepository: UsersRepository
  ) {}
  async execute ( assignRoleToUserDto: AssignRoleToUserDto ): Promise<AssignRoleToUserResponseDto> {
    await this.usersRepository.assignRoleToUser( assignRoleToUserDto )
    return { success: true }
  }
}