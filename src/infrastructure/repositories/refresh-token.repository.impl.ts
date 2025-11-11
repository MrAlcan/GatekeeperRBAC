import { RefreshTokenRepository } from '@/domain/repositories'
import { RefreshTokenEntity } from '@/domain/entities'
import { EntityIdVO } from '@/domain/value-objects'
import { NotFoundError } from '@/domain/errors'
import { prisma } from '../data/prisma'
import { RefreshTokenMapper } from '@/application/mappers'
export class RefreshTokenRepositoryImpl implements RefreshTokenRepository {
  async create(
    userId: EntityIdVO,
    token: string,
    expiresAt: Date,
    ipAddress?: string,
    userAgent?: string
  ): Promise<RefreshTokenEntity> {
    const tokenRaw = await prisma.refreshToken.create({
      data: {
        token,
        userId: userId.value,
        expiresAt,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null
      }
    })

    return RefreshTokenMapper.toDomain(tokenRaw)
  }

  async findByToken(token: string): Promise<RefreshTokenEntity | null> {
    const tokenRaw = await prisma.refreshToken.findUnique({
      where: { token }
    })

    if (!tokenRaw) return null

    return RefreshTokenMapper.toDomain(tokenRaw)
  }

  async revoke(tokenId: EntityIdVO, replacedBy?: string): Promise<void> {
    await prisma.refreshToken.update({
      where: { id: tokenId.value },
      data: {
        revokedAt: new Date(),
        replacedBy: replacedBy || null
      }
    })
  }

  async revokeAllForUser(userId: EntityIdVO): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: {
        userId: userId.value,
        revokedAt: null
      },
      data: {
        revokedAt: new Date()
      }
    })
  }

  async findActiveByUserId(userId: EntityIdVO): Promise<RefreshTokenEntity[]> {
    const tokensRaw = await prisma.refreshToken.findMany({
      where: {
        userId: userId.value,
        revokedAt: null,
        expiresAt: {
          gt: new Date()
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return tokensRaw.map((t: any) => RefreshTokenMapper.toDomain(t))
  }

  async deleteExpired(): Promise<number> {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })

    return result.count
  }
}