import type { RolesRepository } from '@/domain/repositories'
import type { AuditLoggerPort } from '@/application/ports'
import type { CreateRoleInput } from '@/domain/schemas'
import type { CreateRoleResponseDTO } from '@/application/dtos'
import { DomainError } from '@/domain/errors'
import { RoleMapper } from '@/application/mappers'

export class CreateRoleUseCase {
  constructor(
    private readonly rolesRepository: RolesRepository,
    private readonly auditLogger: AuditLoggerPort
  ) {}

  async execute(
    input: CreateRoleInput,
    context?: { ipAddress?: string; userAgent?: string }
  ): Promise<CreateRoleResponseDTO> {
    const nameExists = await this.rolesRepository.nameExists( input.name )
    if ( nameExists ) {
      throw DomainError.duplicateRole( input.name )
    }
    const role = await this.rolesRepository.create(
      input.name,
      input.description
    )
    await this.auditLogger.logCreate(
      'Role',
      role.id.value,
      {
        name: input.name,
        description: input.description
      },
      context
    )

    return {
      success: true,
      data: RoleMapper.toDTO( role )
    }
  }
}