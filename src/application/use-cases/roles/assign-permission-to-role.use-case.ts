import type { AssignPermissionToRoleDto } from '@/domain/dtos'
import type { RolesRepository } from '@/domain/repositories'
import { CustomError } from '@/domain/errors'

export interface AssignPermissionToRoleResponseDto {
  success: boolean
}

export class AssignPermissionToRoleUseCase {
  constructor (
    private readonly rolesRepository: RolesRepository
  ) {}
  async execute ( assignPermissionToRoleDto: AssignPermissionToRoleDto ): Promise<AssignPermissionToRoleResponseDto> {
    await this.rolesRepository.assignPermissionToRole( assignPermissionToRoleDto )
    return { success: true }
  }
}