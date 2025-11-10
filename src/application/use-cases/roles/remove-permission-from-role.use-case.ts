import type { RemovePermissionFromRoleDto } from '@/domain/dtos'
import type { RolesRepository } from '@/domain/repositories'

export interface RemovePermissionFromRoleResponseDto {
  success: boolean
}

export class RemovePermissionFromRoleUseCase {
  constructor (
    private readonly rolesRepository: RolesRepository
  ) {}
  async execute ( removePermissionFromRoleDto: RemovePermissionFromRoleDto ): Promise<RemovePermissionFromRoleResponseDto> {
    await this.rolesRepository.removePermissionFromRole( removePermissionFromRoleDto )
    return { success: true }
  }
}