import type { RolesRepository, PermissionsRepository } from '@/domain/repositories'
import type { AuditLoggerPort } from '@/application/ports'
import type { RemovePermissionFromRoleInput } from '@/domain/schemas'
import type { RemovePermissionFromRoleResponseDTO } from '@/application/dtos'
import { EntityIdVO } from '@/domain/value-objects'
import { NotFoundError } from '@/domain/errors'
import { AuditAction } from '@/domain/entities'

export class RemovePermissionFromRoleUseCase {
  constructor(
    private readonly rolesRepository: RolesRepository,
    private readonly permissionsRepository: PermissionsRepository,
    private readonly auditLogger: AuditLoggerPort
  ) {}

  async execute(
    input: RemovePermissionFromRoleInput,
    context?: { ipAddress?: string; userAgent?: string }
  ): Promise<RemovePermissionFromRoleResponseDTO> {
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

    await this.rolesRepository.removePermission(roleIdVO, permissionIdVO)

    await this.auditLogger.log(
      AuditAction.PERMISSION_REMOVED,
      'Role',
      input.roleId,
      { permissionId: input.permissionId, permissionSlug: permission.slug.value },
      null,
      context
    )

    return {
      success: true,
      message: `Permission "${permission.slug.value}" removed successfully`
    }
  }
}