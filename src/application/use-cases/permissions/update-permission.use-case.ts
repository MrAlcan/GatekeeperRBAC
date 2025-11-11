import type { PermissionsRepository } from '@/domain/repositories'
import type { AuditLoggerPort } from '@/application/ports'
import type { UpdatePermissionInput } from '@/domain/schemas'
import type { UpdatePermissionResponseDTO } from '@/application/dtos'
import { EntityIdVO } from '@/domain/value-objects'
import { NotFoundError } from '@/domain/errors'
import { PermissionMapper } from '@/application/mappers'

export class UpdatePermissionUseCase {
  constructor(
    private readonly permissionsRepository: PermissionsRepository,
    private readonly auditLogger: AuditLoggerPort
  ) {}

  async execute(
    input: UpdatePermissionInput,
    context?: { ipAddress?: string; userAgent?: string }
  ): Promise<UpdatePermissionResponseDTO> {
    const permissionIdVO = EntityIdVO.create(input.id)

    const existingPermission = await this.permissionsRepository.findById(permissionIdVO)
    if (!existingPermission) {
      throw NotFoundError.permission(input.id)
    }

    const oldValues = {
      name: existingPermission.name,
      description: existingPermission.description
    }

    const updatedPermission = await this.permissionsRepository.update(permissionIdVO, {
      name: input.name,
      description: input.description
    })

    const newValues = {
      name: updatedPermission.name,
      description: updatedPermission.description
    }

    await this.auditLogger.logUpdate(
      'Permission',
      input.id,
      oldValues,
      newValues,
      context
    )

    return {
      success: true,
      data: PermissionMapper.toDTO(updatedPermission)
    }
  }
}