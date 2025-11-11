import type { AuthRepository } from '@/domain/repositories'
import type { PasswordHasherPort, EmailSenderPort, AuditLoggerPort } from '@/application/ports'
import type { ResetPasswordInput } from '@/domain/schemas'
import type { ResetPasswordResponseDTO } from '@/application/dtos'
import { PasswordVO } from '@/domain/value-objects'
import { AuditAction } from '@/domain/entities'

export class ResetPasswordUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly emailSender: EmailSenderPort,
    private readonly auditLogger: AuditLoggerPort
  ) {}

  async execute(
    input: ResetPasswordInput,
    context?: { ipAddress?: string; userAgent?: string }
  ): Promise<ResetPasswordResponseDTO> {
    const user = await this.authRepository.validatePasswordResetToken(input.token)

    const passwordVO = PasswordVO.createFromPlainText(input.password)

    const hashedPassword = await passwordVO.hash()

    await this.authRepository.resetPassword(input.token, hashedPassword.value)

    await this.emailSender.sendPasswordChangedEmail(
      user.email.value,
      user.name
    )

    await this.auditLogger.log(
      AuditAction.PASSWORD_RESET,
      'User',
      user.id.value,
      null,
      null,
      context
    )

    return {
      success: true,
      message: 'Password has been reset successfully'
    }
  }
}