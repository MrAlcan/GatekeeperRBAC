import { PermissionEntity } from '@/domain/entities/users/permission.entity'
import { CustomError } from '@/domain/errors'
import { EntityIdVO } from '@/domain/value-objects'
import { PermissionSlugVO } from '@/domain/value-objects/permission-slug.value-object'

export interface PermissionObject {
  id: string,
  slug: string,
  name: string,
  description?: string,
}

export class PermissionMapper {

  static entityFromObject( object: { [ key: string ]: any } ): PermissionEntity {
    if ( !object ) throw CustomError.badRequest( 'permission.object.required' )
    const { id, slug, name, description } = object
    if ( !id ) throw CustomError.badRequest( 'permission.id.required' )
    if ( !slug ) throw CustomError.badRequest( 'permission.slug.required' )
    if ( !name ) throw CustomError.badRequest( 'permission.name.required' )
    const entityId = EntityIdVO.create( id )
    const permissionSlug = PermissionSlugVO.create( slug )
    return new PermissionEntity( entityId, permissionSlug, name, description )
  }

  static objectFromEntity( entity: PermissionEntity ): PermissionObject {
    return {
      id: entity.id.value,
      slug: entity.slug.value,
      name: entity.name,
      description: entity.description,
    }
  }
}