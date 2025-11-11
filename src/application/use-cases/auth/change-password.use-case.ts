import type { AuthRepository } from '@/domain/repositories'
import type { PasswordHasherPort, EmailSenderPort, AuditLoggerPort } from '@/application/ports'
import type { ChangePasswordInput } from '@/domain/schemas'
import type { ChangePasswordResponseDTO } from '@/application/dtos'
import { EntityIdVO, PasswordVO } from '@/domain/value-objects'
import { AuthenticationError } from '@/domain/errors'
import { AuditAction } from '@/domain/entities'

export class ChangePasswordUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly emailSender: EmailSenderPort,
    private readonly auditLogger: AuditLoggerPort
  ) {}

  async execute(
    userId: string,
    input: ChangePasswordInput,
    context?: { ipAddress?: string; userAgent?: string }
  ): Promise<ChangePasswordResponseDTO> {
    const userIdVO = EntityIdVO.create( userId )

    const user = await this.authRepository.findById( userIdVO )
    if ( !user ) {
      throw AuthenticationError.userNotFound()
    }
    try {
      await this.authRepository.changePassword(
        userIdVO,
        input.currentPassword,
        input.newPassword
      )
    } catch ( error ) {
      throw AuthenticationError.invalidCredentials()
    }

    await this.emailSender.sendPasswordChangedEmail(
      user.email.value,
      user.name
    )

    await this.auditLogger.log(
      AuditAction.PASSWORD_CHANGED,
      'User',
      userId,
      null,
      null,
      context
    )

    return {
      success: true,
      message: 'Password changed successfully'
    }
  }
}