import type { PermissionsRepository } from '@/domain/repositories'
import type { PaginationParams } from '@/domain/repositories'
import type { ListPermissionsResponseDTO } from '@/application/dtos'
import { PermissionMapper, PaginationMapper } from '@/application/mappers'

export class ListPermissionsUseCase {
  constructor(
    private readonly permissionsRepository: PermissionsRepository
  ) {}

  async execute(params: PaginationParams): Promise<ListPermissionsResponseDTO> {
    const paginatedPermissions = await this.permissionsRepository.findMany(params)

    const paginatedDTO = PaginationMapper.toPaginatedDTO(
      paginatedPermissions,
      PermissionMapper.toDTO
    )

    return {
      success: true,
      data: paginatedDTO.data,
      pagination: paginatedDTO.pagination
    }
  }
}