import type { AuthRepository } from '@/domain/repositories'
import type { EmailSenderPort } from '@/application/ports'
import type { ForgotPasswordInput } from '@/domain/schemas'
import type { ForgotPasswordResponseDTO } from '@/application/dtos'
import { EmailVO } from '@/domain/value-objects'
import { NotFoundError } from '@/domain/errors'

export class ForgotPasswordUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly emailSender: EmailSenderPort
  ) {}

  async execute(
    input: ForgotPasswordInput,
    baseUrl: string
  ): Promise<ForgotPasswordResponseDTO> {
    const emailVO = EmailVO.create( input.email )

    const user = await this.authRepository.findByEmail( emailVO )

    if ( user && user.isActive ) {
      const resetToken = await this.authRepository.generatePasswordResetToken( emailVO )

      const resetUrl = `${ baseUrl }/reset-password?token=${ resetToken }`

      await this.emailSender.sendPasswordResetEmail(
        user.email.value,
        user.name,
        resetToken,
        resetUrl
      )
    }

    return {
      success: true,
      message: 'If the email exists, a password reset link has been sent'
    }
  }
}