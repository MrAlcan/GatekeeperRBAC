import { UserEntity } from '@/domain/entities'
import { EntityIdVO, EmailVO } from '@/domain/value-objects'
import { RoleMapper } from './role.mapper'

export interface UserRaw {
  id: string
  name: string
  lastName: string
  email: string
  password: string
  isActive: boolean
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
  roles?: Array<{
    role: {
      id: string
      name: string
      description: string | null
      permissions: Array<{
        permission: {
          id: string
          slug: string
          name: string
          description: string | null
        }
      }>
    }
  }>
}

export interface UserDTO {
  id: string
  name: string
  lastName: string
  fullName: string
  email: string
  isActive: boolean
  emailVerified: boolean
  roles: Array<{
    id: string
    name: string
    description?: string
    permissions: Array<{
      id: string
      slug: string
      name: string
      description?: string
    }>
  }>
  createdAt: string
  updatedAt: string
}

export interface UserPersistence {
  id: string
  name: string
  last_name: string
  email: string
  password: string
  is_active: boolean
  email_verified: boolean
}

export class UserMapper {
  static toDomain( raw: UserRaw ): UserEntity {
    const roles = raw.roles
      ? raw.roles.map(ur => RoleMapper.toDomain({
          id: ur.role.id,
          name: ur.role.name,
          description: ur.role.description,
          permissions: ur.role.permissions.map( rp => ({
            id: rp.permission.id,
            slug: rp.permission.slug,
            name: rp.permission.name,
            description: rp.permission.description
          }))
        }))
      : []

    return new UserEntity(
      EntityIdVO.create( raw.id ),
      raw.name,
      raw.lastName,
      EmailVO.create( raw.email ),
      roles,
      raw.isActive,
      raw.emailVerified,
      raw.createdAt,
      raw.updatedAt
    )
  }

  static toDTO( entity: UserEntity ): UserDTO {
    return {
      id: entity.id.value,
      name: entity.name,
      lastName: entity.lastName,
      fullName: entity.getFullName(),
      email: entity.email.value,
      isActive: entity.isActive,
      emailVerified: entity.emailVerified,
      roles: entity.roles.map( RoleMapper.toDTO ),
      createdAt: entity.createdAt?.toISOString() || '',
      updatedAt: entity.updatedAt?.toISOString() || ''
    }
  }

  static toPersistence( entity: UserEntity, password?: string ): UserPersistence {
    return {
      id: entity.id.value,
      name: entity.name,
      last_name: entity.lastName,
      email: entity.email.value,
      password: password || '',
      is_active: entity.isActive,
      email_verified: entity.emailVerified
    }
  }

  static toSimpleDTO( entity: UserEntity ): Omit<UserDTO, 'roles'> {
    return {
      id: entity.id.value,
      name: entity.name,
      lastName: entity.lastName,
      fullName: entity.getFullName(),
      email: entity.email.value,
      isActive: entity.isActive,
      emailVerified: entity.emailVerified,
      createdAt: entity.createdAt?.toISOString() || '',
      updatedAt: entity.updatedAt?.toISOString() || ''
    }
  }
}