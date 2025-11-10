import type { RemoveRoleFromUserDto } from "@/domain/dtos";
import type { UsersRepository } from "@/domain/repositories";

export interface RemoveRoleFromUserResponseDto {
  success: boolean
}

export class RemoveRoleFromUserUseCase {
  constructor (
    private readonly usersRepository: UsersRepository
  ) {}
  async execute ( removeRoleFromUserDto: RemoveRoleFromUserDto ): Promise<RemoveRoleFromUserResponseDto> {
    await this.usersRepository.removeRoleFromUser( removeRoleFromUserDto )
    return { success: true }
  }
}