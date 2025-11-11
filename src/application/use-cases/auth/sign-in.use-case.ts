import type { AuthRepository, RefreshTokenRepository } from '@/domain/repositories'
import type { TokenGeneratorPort, PasswordHasherPort, AuditLoggerPort } from '@/application/ports'
import type { SignInInput } from '@/domain/schemas'
import type { SignInResponseDTO } from '@/application/dtos'
import { EmailVO } from '@/domain/value-objects'
import { AuthenticationError } from '@/domain/errors'
import { UserMapper } from '@/application/mappers'
import { AuditAction } from '@/domain/entities'

export class SignInUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly tokenGenerator: TokenGeneratorPort,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly auditLogger: AuditLoggerPort
  ) {}

  async execute(
    input: SignInInput,
    context?: { ipAddress?: string; userAgent?: string }
  ): Promise<SignInResponseDTO> {
    const emailVO = EmailVO.create( input.email )

    const user = await this.authRepository.findByEmail( emailVO )
    if ( !user ) {
      await this.auditLogger.logLoginFailed( input.email, context )
      throw AuthenticationError.invalidCredentials()
    }

    if ( !user.isActive ) {
      throw AuthenticationError.accountInactive()
    }

    if ( !user.emailVerified ) {
      throw AuthenticationError.emailNotVerified()
    }
/*
    const userWithPassword = await this.authRepository.signIn( emailVO, input.password )

    const isValid = await this.passwordHasher.compare( input.password, userPassword )
    if ( !isValid ) {
      await this.auditLogger.logLoginFailed( input.email, context )
      throw AuthenticationError.invalidCredentials()
    }
*/
    const accessToken = await this.tokenGenerator.generateAccessToken({
      userId: user.id.value,
      email: user.email.value,
      roles: user.roles.map( r => r.name )
    })

    const refreshTokenPayload = {
      userId: user.id.value,
      tokenId: ''
    }

    const expiresAt = new Date()
    expiresAt.setDate( expiresAt.getDate() + 7 )

    const refreshTokenString = await this.tokenGenerator.generateRefreshToken(
      refreshTokenPayload,
      '7d'
    )

    const refreshTokenEntity = await this.refreshTokenRepository.create(
      user.id,
      refreshTokenString,
      expiresAt,
      context?.ipAddress,
      context?.userAgent
    )

    await this.auditLogger.logLogin( user.id.value, context )

    return {
      success: true,
      data: {
        user: UserMapper.toDTO( user ),
        accessToken,
        refreshToken: refreshTokenString
      }
    }
  }
}