import { RoleEntity } from '@/domain/entities/users/role.entity'
import { CustomError } from '@/domain/errors'
import { EntityIdVO } from '@/domain/value-objects'
import { PermissionSlugVO } from '@/domain/value-objects/permission-slug.value-object'
import { PermissionMapper, type PermissionObject } from './permission.mapper'

export interface RoleObject {
  id: string,
  name: string,
  permissions: {
    id: string,
    slug: string,
    name: string,
    description?: string,
  }[],
  description?: string,
}

export class RoleMapper {
  static entityFromObject( object: { [ key: string ]: any } ): RoleEntity {
    if ( !object ) throw CustomError.badRequest( 'role.object.required' )
    const { id, name, permissions, description } = object
    if ( !id ) throw CustomError.badRequest( 'role.id.required' )
    if ( !name ) throw CustomError.badRequest( 'role.name.required' )
    const entityId = EntityIdVO.create( id )
    const permissionsEntity = permissions.map( ( permission: PermissionObject ) => PermissionMapper.entityFromObject( permission ) )
    return new RoleEntity( entityId, name, permissionsEntity, description )
  }

  static objectFromEntity( entity: RoleEntity ): RoleObject {
    return {
      id: entity.id.value,
      name: entity.name,
      permissions: entity.permissions.map( permission => PermissionMapper.objectFromEntity( permission ) ),
      description: entity.description,
    }
  }
}