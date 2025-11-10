import type { PaginationDto } from '@/domain/dtos'
import type { PaginationEntity, RoleEntity } from '@/domain/entities'
import type { RolesRepository } from '@/domain/repositories'
import type { PaginatedResponseEntity } from '@/domain/entities'
import { CustomError } from '@/domain/errors'

export interface ListRolesResponseDto {
  success: boolean
  data: RoleEntity[]
  pagination: PaginationEntity
}

export class ListRolesUseCase {
  constructor (
    private readonly rolesRepository: RolesRepository
  ) {}
  async execute ( paginationDto: PaginationDto ): Promise<ListRolesResponseDto> {
    const roles: PaginatedResponseEntity<RoleEntity[]> = await this.rolesRepository.listRoles( paginationDto )
    if ( !roles ) {
      throw CustomError.notFound( 'errors.listRoles.roles.notFound' )
    }
    return { success: true, data: roles.data, pagination: roles.pagination }
  }
}