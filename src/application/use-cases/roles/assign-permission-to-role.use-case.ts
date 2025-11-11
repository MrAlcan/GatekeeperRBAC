import type { RolesRepository, PermissionsRepository } from '@/domain/repositories'
import type { AuditLoggerPort } from '@/application/ports'
import type { AssignPermissionToRoleInput } from '@/domain/schemas'
import type { AssignPermissionToRoleResponseDTO } from '@/application/dtos'
import { EntityIdVO } from '@/domain/value-objects'
import { NotFoundError } from '@/domain/errors'
import { AuditAction } from '@/domain/entities'

export class AssignPermissionToRoleUseCase {
  constructor(
    private readonly rolesRepository: RolesRepository,
    private readonly permissionsRepository: PermissionsRepository,
    private readonly auditLogger: AuditLoggerPort
  ) {}

  async execute(
    input: AssignPermissionToRoleInput,
    context?: { ipAddress?: string; userAgent?: string }
  ): Promise<AssignPermissionToRoleResponseDTO> {
    const roleIdVO = EntityIdVO.create(input.roleId)
    const permissionIdVO = EntityIdVO.create(input.permissionId)

    const role = await this.rolesRepository.findById(roleIdVO)
    if (!role) {
      throw NotFoundError.role(input.roleId)
    }

    const permission = await this.permissionsRepository.findById(permissionIdVO)
    if (!permission) {
      throw NotFoundError.permission(input.permissionId)
    }

    await this.rolesRepository.assignPermission(roleIdVO, permissionIdVO)

    await this.auditLogger.log(
      AuditAction.PERMISSION_ASSIGNED,
      'Role',
      input.roleId,
      null,
      { permissionId: input.permissionId, permissionSlug: permission.slug.value },
      context
    )

    return {
      success: true,
      message: `Permission "${permission.slug.value}" assigned successfully`
    }
  }
}