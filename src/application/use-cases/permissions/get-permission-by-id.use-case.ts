import type { PermissionsRepository } from '@/domain/repositories'
import type { GetPermissionByIdInput } from '@/domain/schemas'
import type { GetPermissionByIdResponseDTO } from '@/application/dtos'
import { EntityIdVO } from '@/domain/value-objects'
import { NotFoundError } from '@/domain/errors'
import { PermissionMapper } from '@/application/mappers'

export class GetPermissionByIdUseCase {
  constructor(
    private readonly permissionsRepository: PermissionsRepository
  ) {}

  async execute(input: GetPermissionByIdInput): Promise<GetPermissionByIdResponseDTO> {
    const permissionIdVO = EntityIdVO.create(input.id)

    const permission = await this.permissionsRepository.findById(permissionIdVO)
    if (!permission) {
      throw NotFoundError.permission(input.id)
    }

    return {
      success: true,
      data: PermissionMapper.toDTO(permission)
    }
  }
}