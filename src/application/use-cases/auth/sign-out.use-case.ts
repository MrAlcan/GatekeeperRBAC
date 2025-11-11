import type { RefreshTokenRepository } from '@/domain/repositories'
import type { AuditLoggerPort } from '@/application/ports'
import type { SignOutResponseDTO } from '@/application/dtos'
import { EntityIdVO } from '@/domain/value-objects'

export class SignOutUseCase {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly auditLogger: AuditLoggerPort
  ) {}

  async execute(
    userId: string,
    refreshToken?: string,
    context?: { ipAddress?: string; userAgent?: string }
  ): Promise<SignOutResponseDTO> {
    const userIdVO = EntityIdVO.create( userId )

    if ( refreshToken ) {
      const tokenEntity = await this.refreshTokenRepository.findByToken( refreshToken )
      if ( tokenEntity && tokenEntity.userId.equals( userIdVO ) ) {
        await this.refreshTokenRepository.revoke( tokenEntity.id )
      }
    } else {
      await this.refreshTokenRepository.revokeAllForUser( userIdVO )
    }

    await this.auditLogger.logLogout( userId, context )

    return {
      success: true,
      message: 'Signed out successfully'
    }
  }
}