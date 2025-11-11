import type { RolesRepository } from '@/domain/repositories'
import type { PaginationParams } from '@/domain/repositories'
import type { ListRolesResponseDTO } from '@/application/dtos'
import { RoleMapper, PaginationMapper } from '@/application/mappers'

export class ListRolesUseCase {
  constructor(
    private readonly rolesRepository: RolesRepository
  ) {}

  async execute(params: PaginationParams): Promise<ListRolesResponseDTO> {
    const paginatedRoles = await this.rolesRepository.findMany(params)

    const paginatedDTO = PaginationMapper.toPaginatedDTO(
      paginatedRoles,
      RoleMapper.toDTO
    )

    return {
      success: true,
      data: paginatedDTO.data,
      pagination: paginatedDTO.pagination
    }
  }
}