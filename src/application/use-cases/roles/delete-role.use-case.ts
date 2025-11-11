import type { RolesRepository } from '@/domain/repositories'
import type { AuditLoggerPort } from '@/application/ports'
import type { DeleteRoleInput } from '@/domain/schemas'
import type { DeleteRoleResponseDTO } from '@/application/dtos'
import { EntityIdVO } from '@/domain/value-objects'
import { NotFoundError, DomainError } from '@/domain/errors'

export class DeleteRoleUseCase {
  constructor(
    private readonly rolesRepository: RolesRepository,
    private readonly auditLogger: AuditLoggerPort
  ) {}

  async execute(
    input: DeleteRoleInput,
    context?: { ipAddress?: string; userAgent?: string }
  ): Promise<DeleteRoleResponseDTO> {
    const roleIdVO = EntityIdVO.create(input.id)

    const role = await this.rolesRepository.findById(roleIdVO)
    if (!role) {
      throw NotFoundError.role(input.id)
    }
    const hasUsers = await this.rolesRepository.hasUsers(roleIdVO)
    if (hasUsers) {
      throw DomainError.roleHasUsers(role.name)
    }
    const oldValues = {
      name: role.name,
      description: role.description,
      permissionCount: role.getPermissionCount()
    }

    await this.rolesRepository.delete(roleIdVO)

    await this.auditLogger.logDelete(
      'Role',
      input.id,
      oldValues,
      context
    )

    return {
      success: true,
      message: 'Role deleted successfully'
    }
  }
}