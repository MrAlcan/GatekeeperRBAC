import { EntityIdVO } from '@/domain/value-objects'

export class RefreshTokenEntity {
  constructor(
    public readonly id: EntityIdVO,
    public readonly token: string,
    public readonly userId: EntityIdVO,
    public readonly expiresAt: Date,
    public readonly createdAt: Date,
    public readonly revokedAt: Date | null = null,
    public readonly replacedBy: string | null = null,
    public readonly ipAddress: string | null = null,
    public readonly userAgent: string | null = null
  ) {}

  isExpired(): boolean {
    return new Date() > this.expiresAt
  }

  isRevoked(): boolean {
    return this.revokedAt !== null
  }

  isValid(): boolean {
    return !this.isExpired() && !this.isRevoked()
  }

  daysUntilExpiration(): number {
    const now = new Date()
    const diff = this.expiresAt.getTime() - now.getTime()
    return Math.ceil( diff / ( 1000 * 60 * 60 * 24 ) )
  }
}