import { RoleEntity, PaginatedResponseEntity } from '../entities'
import { EntityIdVO } from '../value-objects'
import type { PaginationParams } from './users.repository'

export abstract class RolesRepository {
  abstract create(
    name: string,
    description?: string
  ): Promise<RoleEntity>

  abstract update(
    id: EntityIdVO,
    data: {
      name?: string
      description?: string
    }
  ): Promise<RoleEntity>
  abstract delete( id: EntityIdVO ): Promise<void>
  abstract findById( id: EntityIdVO ): Promise<RoleEntity | null>
  abstract findByName( name: string ): Promise<RoleEntity | null>
  abstract findMany( params: PaginationParams ): Promise<PaginatedResponseEntity<RoleEntity[]>>
  abstract assignPermission( roleId: EntityIdVO, permissionId: EntityIdVO ): Promise<void>
  abstract removePermission( roleId: EntityIdVO, permissionId: EntityIdVO ): Promise<void>
  abstract hasUsers( roleId: EntityIdVO ): Promise<boolean>
  abstract nameExists( name: string ): Promise<boolean>
}