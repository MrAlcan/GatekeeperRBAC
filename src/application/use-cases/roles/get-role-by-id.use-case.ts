import type { RolesRepository } from '@/domain/repositories'
import type { GetRoleByIdInput } from '@/domain/schemas'
import type { GetRoleByIdResponseDTO } from '@/application/dtos'
import { EntityIdVO } from '@/domain/value-objects'
import { NotFoundError } from '@/domain/errors'
import { RoleMapper } from '@/application/mappers'

export class GetRoleByIdUseCase {
  constructor(
    private readonly rolesRepository: RolesRepository
  ) {}

  async execute(input: GetRoleByIdInput): Promise<GetRoleByIdResponseDTO> {
    const roleIdVO = EntityIdVO.create(input.id)

    const role = await this.rolesRepository.findById(roleIdVO)
    if (!role) {
      throw NotFoundError.role(input.id)
    }

    return {
      success: true,
      data: RoleMapper.toDTO(role)
    }
  }
}