import { RefreshTokenEntity } from '../entities'
import { EntityIdVO } from '../value-objects'

export abstract class RefreshTokenRepository {
  abstract create(
    userId: EntityIdVO,
    token: string,
    expiresAt: Date,
    ipAddress?: string,
    userAgent?: string
  ): Promise<RefreshTokenEntity>
  abstract findByToken( token: string ): Promise<RefreshTokenEntity | null>
  abstract revoke( tokenId: EntityIdVO, replacedBy?: string ): Promise<void>
  abstract revokeAllForUser( userId: EntityIdVO ): Promise<void>
  abstract findActiveByUserId( userId: EntityIdVO ): Promise<RefreshTokenEntity[]>
  abstract deleteExpired(): Promise<number>
}