import type { RefreshTokenRepository, AuthRepository } from '@/domain/repositories'
import type { TokenGeneratorPort, AuditLoggerPort } from '@/application/ports'
import type { RefreshTokenInput } from '@/domain/schemas'
import type { RefreshTokenResponseDTO } from '@/application/dtos'
import { AuthenticationError, NotFoundError } from '@/domain/errors'

export class RefreshTokenUseCase {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly authRepository: AuthRepository,
    private readonly tokenGenerator: TokenGeneratorPort,
    private readonly auditLogger: AuditLoggerPort
  ) {}

  async execute(
    input: RefreshTokenInput,
    context?: { ipAddress?: string; userAgent?: string }
  ): Promise<RefreshTokenResponseDTO> {
    const payload = await this.tokenGenerator.validateRefreshToken( input.refreshToken )
    if ( !payload ) {
      throw AuthenticationError.tokenInvalid()
    }

    const tokenEntity = await this.refreshTokenRepository.findByToken( input.refreshToken )
    if ( !tokenEntity ) {
      throw NotFoundError.refreshToken()
    }

    if ( tokenEntity.isRevoked() ) {
      throw AuthenticationError.tokenInvalid()
    }

    if ( tokenEntity.isExpired() ) {
      throw AuthenticationError.tokenExpired()
    }

    const user = await this.authRepository.findById( tokenEntity.userId )
    if ( !user ) {
      throw NotFoundError.user()
    }

    if ( !user.isActive ) {
      throw AuthenticationError.accountInactive()
    }

    const accessToken = await this.tokenGenerator.generateAccessToken({
      userId: user.id.value,
      email: user.email.value,
      roles: user.roles.map( r => r.name )
    })

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const newRefreshTokenString = await this.tokenGenerator.generateRefreshToken(
      { userId: user.id.value, tokenId: '' },
      '7d'
    )

    const newTokenEntity = await this.refreshTokenRepository.create(
      user.id,
      newRefreshTokenString,
      expiresAt,
      context?.ipAddress,
      context?.userAgent
    )

    await this.refreshTokenRepository.revoke(
      tokenEntity.id,
      newTokenEntity.id.value
    )

    return {
      success: true,
      data: {
        accessToken,
        refreshToken: newRefreshTokenString
      }
    }
  }
}