import type { UsersRepository } from '@/domain/repositories'
import type { PaginationParams } from '@/domain/repositories'
import type { ListUsersResponseDTO } from '@/application/dtos'
import { UserMapper, PaginationMapper } from '@/application/mappers'

export class ListUsersUseCase {
  constructor(
    private readonly usersRepository: UsersRepository
  ) {}

  async execute( params: PaginationParams ): Promise<ListUsersResponseDTO> {
    const paginatedUsers = await this.usersRepository.findMany( params )

    const paginatedDTO = PaginationMapper.toPaginatedDTO(
      paginatedUsers,
      UserMapper.toDTO
    )

    return {
      success: true,
      data: paginatedDTO.data,
      pagination: paginatedDTO.pagination
    }
  }
}