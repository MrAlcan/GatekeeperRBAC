import { CustomError } from '@/domain/errors'
import { EntityIdVO } from '@/domain/value-objects'
import { RoleEntity } from '@/domain/entities/users/role.entity'
import { RoleMapper, type RoleObject } from './role.mapper'
import { UserEntity } from '@/domain/entities/users/user.entity'

export interface UserObject {
  id: string,
  name: string,
  lastName: string,
  email: string,
  roles: {
    id: string,
    name: string,
    permissions: {
      id: string,
      slug: string,
      name: string,
      description?: string,
    }[],
    description?: string,
  }[],
  isActive: boolean,
}

export class UserMapper {
  static entityFromObject( object: { [ key: string ]: any } ): UserEntity {
    if ( !object ) throw CustomError.badRequest( 'user.object.required' )
    const { id, name, lastName, email, roles, isActive } = object
    if ( !id ) throw CustomError.badRequest( 'user.id.required' )
    if ( !name ) throw CustomError.badRequest( 'user.name.required' )
    if ( !lastName ) throw CustomError.badRequest( 'user.lastName.required' )
    if ( !email ) throw CustomError.badRequest( 'user.email.required' )
    if ( !roles ) throw CustomError.badRequest( 'user.roles.required' )
    if ( !isActive ) throw CustomError.badRequest( 'user.isActive.required' )
    const entityId = EntityIdVO.create( id )
    const rolesEntity = roles.map( ( role: RoleObject ) => RoleMapper.entityFromObject( role ) )
    return new UserEntity( entityId, name, lastName, email, rolesEntity, isActive )
  }

  static objectFromEntity( entity: UserEntity ): UserObject {
    return {
      id: entity.id.value,
      name: entity.name,
      lastName: entity.lastName,
      email: entity.email.value,
      roles: entity.roles.map( role => RoleMapper.objectFromEntity( role ) as RoleObject ),
      isActive: entity.isActive,
    }
  }
}
