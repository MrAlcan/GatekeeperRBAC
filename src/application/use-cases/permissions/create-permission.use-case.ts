import type { PermissionsRepository } from '@/domain/repositories'
import type { AuditLoggerPort } from '@/application/ports'
import type { CreatePermissionInput } from '@/domain/schemas'
import type { CreatePermissionResponseDTO } from '@/application/dtos'
import { PermissionSlugVO } from '@/domain/value-objects'
import { DomainError } from '@/domain/errors'
import { PermissionMapper } from '@/application/mappers'

export class CreatePermissionUseCase {
  constructor(
    private readonly permissionsRepository: PermissionsRepository,
    private readonly auditLogger: AuditLoggerPort
  ) {}

  async execute(
    input: CreatePermissionInput,
    context?: { ipAddress?: string; userAgent?: string }
  ): Promise<CreatePermissionResponseDTO> {
    const slugVO = PermissionSlugVO.create(input.slug)

    const slugExists = await this.permissionsRepository.slugExists(slugVO)
    if (slugExists) {
      throw DomainError.duplicatePermission(input.slug)
    }

    const permission = await this.permissionsRepository.create(
      slugVO,
      input.name,
      input.description
    )

    await this.auditLogger.logCreate(
      'Permission',
      permission.id.value,
      {
        slug: input.slug,
        name: input.name,
        description: input.description
      },
      context
    )

    return {
      success: true,
      data: PermissionMapper.toDTO(permission)
    }
  }
}