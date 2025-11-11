import { PermissionEntity } from '@/domain/entities'
import { EntityIdVO, PermissionSlugVO } from '@/domain/value-objects'

export interface PermissionRaw {
  id: string
  slug: string
  name: string
  description: string | null
  createdAt?: Date
  updatedAt?: Date
}

export interface PermissionDTO {
  id: string
  slug: string
  module: string
  action: string
  name: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface PermissionPersistence {
  id: string
  slug: string
  name: string
  description: string | null
}

export class PermissionMapper {
  static toDomain( raw: PermissionRaw ): PermissionEntity {
    return new PermissionEntity(
      EntityIdVO.create( raw.id ),
      PermissionSlugVO.create( raw.slug ),
      raw.name,
      raw.description || undefined,
      raw.createdAt,
      raw.updatedAt
    )
  }

  static toDTO( entity: PermissionEntity ): PermissionDTO {
    return {
      id: entity.id.value,
      slug: entity.slug.value,
      module: entity.getModule(),
      action: entity.getAction(),
      name: entity.name,
      description: entity.description,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString()
    }
  }

  static toPersistence( entity: PermissionEntity ): PermissionPersistence {
    return {
      id: entity.id.value,
      slug: entity.slug.value,
      name: entity.name,
      description: entity.description || null
    }
  }
}