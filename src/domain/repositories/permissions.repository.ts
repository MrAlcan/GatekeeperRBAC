import { PermissionEntity, PaginatedResponseEntity } from '../entities'
import { EntityIdVO, PermissionSlugVO } from '../value-objects'
import type { PaginationParams } from './users.repository'

export abstract class PermissionsRepository {
  abstract create(
    slug: PermissionSlugVO,
    name: string,
    description?: string
  ): Promise<PermissionEntity>
  abstract update(
    id: EntityIdVO,
    data: {
      name?: string
      description?: string
    }
  ): Promise<PermissionEntity>
  abstract delete( id: EntityIdVO ): Promise<void>
  abstract findById( id: EntityIdVO ): Promise<PermissionEntity | null>
  abstract findBySlug( slug: PermissionSlugVO ): Promise<PermissionEntity | null>
  abstract findMany( params: PaginationParams ): Promise<PaginatedResponseEntity<PermissionEntity[]>>
  abstract findByModule( module: string ): Promise<PermissionEntity[]>
  abstract isInUse( permissionId: EntityIdVO ): Promise<boolean>
  abstract slugExists( slug: PermissionSlugVO ): Promise<boolean>
}