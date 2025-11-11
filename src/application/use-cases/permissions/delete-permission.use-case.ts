import type { PermissionsRepository } from '@/domain/repositories'
import type { AuditLoggerPort } from '@/application/ports'
import type { DeletePermissionInput } from '@/domain/schemas'
import type { DeletePermissionResponseDTO } from '@/application/dtos'
import { EntityIdVO } from '@/domain/value-objects'
import { NotFoundError, DomainError } from '@/domain/errors'

export class DeletePermissionUseCase {
  constructor(
    private readonly permissionsRepository: PermissionsRepository,
    private readonly auditLogger: AuditLoggerPort
  ) {}

  async execute(
    input: DeletePermissionInput,
    context?: { ipAddress?: string; userAgent?: string }
  ): Promise<DeletePermissionResponseDTO> {
    const permissionIdVO = EntityIdVO.create(input.id)

    const permission = await this.permissionsRepository.findById(permissionIdVO)
    if (!permission) {
      throw NotFoundError.permission(input.id)
    }

    const isInUse = await this.permissionsRepository.isInUse(permissionIdVO)
    if (isInUse) {
      throw DomainError.permissionInUse(permission.slug.value)
    }

    const oldValues = {
      slug: permission.slug.value,
      name: permission.name,
      description: permission.description
    }

    await this.permissionsRepository.delete(permissionIdVO)

    await this.auditLogger.logDelete(
      'Permission',
      input.id,
      oldValues,
      context
    )

    return {
      success: true,
      message: 'Permission deleted successfully'
    }
  }
}