import { RefreshTokenEntity } from '@/domain/entities'
import { EntityIdVO } from '@/domain/value-objects'

export interface RefreshTokenRaw {
  id: string
  token: string
  userId: string
  expiresAt: Date
  createdAt: Date
  revokedAt: Date | null
  replacedBy: string | null
  ipAddress: string | null
  userAgent: string | null
}

export interface RefreshTokenDTO {
  id: string
  token: string
  expiresAt: string
  createdAt: string
  isValid: boolean
  daysUntilExpiration: number
  ipAddress?: string
  userAgent?: string
}

export class RefreshTokenMapper {
  static toDomain( raw: RefreshTokenRaw ): RefreshTokenEntity {
    return new RefreshTokenEntity(
      EntityIdVO.create( raw.id ),
      raw.token,
      EntityIdVO.create( raw.userId ),
      raw.expiresAt,
      raw.createdAt,
      raw.revokedAt,
      raw.replacedBy,
      raw.ipAddress,
      raw.userAgent
    )
  }

  static toDTO( entity: RefreshTokenEntity ): RefreshTokenDTO {
    return {
      id: entity.id.value,
      token: entity.token,
      expiresAt: entity.expiresAt.toISOString(),
      createdAt: entity.createdAt.toISOString(),
      isValid: entity.isValid(),
      daysUntilExpiration: entity.daysUntilExpiration(),
      ipAddress: entity.ipAddress || undefined,
      userAgent: entity.userAgent || undefined
    }
  }
}