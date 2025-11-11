export interface EmailOptions {
  to: string
  subject: string
  html?: string
  text?: string
  from?: string
}

export interface EmailTemplate {
  template: string
  variables: Record<string, any>
}

export abstract class EmailSenderPort {
  abstract send( options: EmailOptions ): Promise<void>
  abstract sendVerificationEmail(
    email: string,
    name: string,
    token: string,
    verificationUrl: string
  ): Promise<void>

  abstract sendPasswordResetEmail(
    email: string,
    name: string,
    token: string,
    resetUrl: string
  ): Promise<void>

  abstract sendWelcomeEmail(
    email: string,
    name: string
  ): Promise<void>

  abstract sendPasswordChangedEmail(
    email: string,
    name: string
  ): Promise<void>
}