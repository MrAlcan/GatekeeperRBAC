import type { RolesRepository } from '@/domain/repositories'
import type { AuditLoggerPort } from '@/application/ports'
import type { UpdateRoleInput } from '@/domain/schemas'
import type { UpdateRoleResponseDTO } from '@/application/dtos'
import { EntityIdVO } from '@/domain/value-objects'
import { NotFoundError, DomainError } from '@/domain/errors'
import { RoleMapper } from '@/application/mappers'

export class UpdateRoleUseCase {
  constructor(
    private readonly rolesRepository: RolesRepository,
    private readonly auditLogger: AuditLoggerPort
  ) {}

  async execute(
    input: UpdateRoleInput,
    context?: { ipAddress?: string; userAgent?: string }
  ): Promise<UpdateRoleResponseDTO> {
    const roleIdVO = EntityIdVO.create(input.id)

    const existingRole = await this.rolesRepository.findById(roleIdVO)
    if (!existingRole) {
      throw NotFoundError.role(input.id)
    }
    if (input.name && input.name !== existingRole.name) {
      const nameExists = await this.rolesRepository.nameExists(input.name)
      if (nameExists) {
        throw DomainError.duplicateRole(input.name)
      }
    }

    const oldValues = {
      name: existingRole.name,
      description: existingRole.description
    }

    const updatedRole = await this.rolesRepository.update(roleIdVO, {
      name: input.name,
      description: input.description
    })

    const newValues = {
      name: updatedRole.name,
      description: updatedRole.description
    }
    await this.auditLogger.logUpdate(
      'Role',
      input.id,
      oldValues,
      newValues,
      context
    )

    return {
      success: true,
      data: RoleMapper.toDTO(updatedRole)
    }
  }
}