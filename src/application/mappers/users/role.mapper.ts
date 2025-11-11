import { RoleEntity } from '@/domain/entities'
import { EntityIdVO } from '@/domain/value-objects'
import { PermissionMapper } from './permission.mapper'

export interface RoleRaw {
  id: string
  name: string
  description: string | null
  createdAt?: Date
  updatedAt?: Date
  permissions?: Array<{
    id: string
    slug: string
    name: string
    description: string | null
  }>
}

export interface RoleDTO {
  id: string
  name: string
  description?: string
  permissionCount: number
  permissions: Array<{
    id: string
    slug: string
    name: string
    description?: string
  }>
  createdAt?: string
  updatedAt?: string
}

export interface RolePersistence {
  id: string
  name: string
  description: string | null
}

export class RoleMapper {
  static toDomain( raw: RoleRaw ): RoleEntity {
    const permissions = raw.permissions
      ? raw.permissions.map( PermissionMapper.toDomain )
      : []

    return new RoleEntity(
      EntityIdVO.create( raw.id ),
      raw.name,
      permissions,
      raw.description || undefined,
      raw.createdAt,
      raw.updatedAt
    )
  }

  static toDTO( entity: RoleEntity ): RoleDTO {
    return {
      id: entity.id.value,
      name: entity.name,
      description: entity.description,
      permissionCount: entity.getPermissionCount(),
      permissions: entity.permissions.map(PermissionMapper.toDTO),
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString()
    }
  }

  static toPersistence( entity: RoleEntity ): RolePersistence {
    return {
      id: entity.id.value,
      name: entity.name,
      description: entity.description || null
    }
  }

  static toSimpleDTO( entity: RoleEntity ): Omit<RoleDTO, 'permissions'> {
    return {
      id: entity.id.value,
      name: entity.name,
      description: entity.description,
      permissionCount: entity.getPermissionCount(),
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString()
    }
  }
}