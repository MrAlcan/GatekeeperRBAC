import type { AuthRepository } from '@/domain/repositories'
import type { EmailSenderPort, AuditLoggerPort } from '@/application/ports'
import type { VerifyEmailInput } from '@/domain/schemas'
import type { VerifyEmailResponseDTO } from '@/application/dtos'
import { AuthenticationError } from '@/domain/errors'
import { AuditAction } from '@/domain/entities'

export class VerifyEmailUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly emailSender: EmailSenderPort,
    private readonly auditLogger: AuditLoggerPort
  ) {}

  async execute(
    input: VerifyEmailInput,
    context?: { ipAddress?: string; userAgent?: string }
  ): Promise<VerifyEmailResponseDTO> {
    await this.authRepository.verifyEmail(
      input.token as any,
      input.token
    )

    return {
      success: true,
      message: 'Email verified successfully'
    }
  }
}