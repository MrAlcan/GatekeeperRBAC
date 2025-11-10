import type { CreateRoleDto } from '@/domain/dtos'
import type { RoleEntity } from '@/domain/entities'
import type { RolesRepository } from '@/domain/repositories'
import { CustomError } from '@/domain/errors'

export interface CreateRoleResponseDto {
  success: boolean
  data: RoleEntity
}

export class CreateRoleUseCase {
  constructor (
    private readonly rolesRepository: RolesRepository
  ) {}
  async execute ( createRoleDto: CreateRoleDto ): Promise<CreateRoleResponseDto> {
    const role = await this.rolesRepository.createRole( createRoleDto )
    if ( !role ) {
      throw CustomError.notFound( 'errors.createRole.role.notFound' )
    }
    return { success: true, data: role }
  }
}