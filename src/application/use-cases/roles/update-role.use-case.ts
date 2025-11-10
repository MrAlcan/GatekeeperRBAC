import type { UpdateRoleDto } from '@/domain/dtos'
import type { RoleEntity } from '@/domain/entities'
import type { RolesRepository } from '@/domain/repositories'
import { CustomError } from '@/domain/errors'

export interface UpdateRoleResponseDto {
  success: boolean
  data: RoleEntity
}

export class UpdateRoleUseCase {
  constructor (
    private readonly rolesRepository: RolesRepository
  ) {}
  async execute ( updateRoleDto: UpdateRoleDto ): Promise<UpdateRoleResponseDto> {
    const role = await this.rolesRepository.updateRole( updateRoleDto )
    if ( !role ) {
      throw CustomError.notFound( 'errors.updateRole.role.notFound' )
    }
    return { success: true, data: role }
  }
}