import nodemailer, { type Transporter } from 'nodemailer'
import { EmailSenderPort, type EmailOptions } from '@/application/ports'
import { environments } from '../config'
import logger from '@/logger'

export class NodemailerSenderAdapter implements EmailSenderPort {
  private transporter: Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: environments.EMAIL_HOST,
      port: environments.EMAIL_PORT,
      secure: environments.EMAIL_PORT === 465,
      auth: environments.EMAIL_USER && environments.EMAIL_PASS ? {
        user: environments.EMAIL_USER,
        pass: environments.EMAIL_PASS
      } : undefined
    })
  }

  async send(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: options.from || environments.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text
      })

      logger.info({ to: options.to, subject: options.subject }, 'Email sent successfully')
    } catch (error) {
      logger.error({ error, to: options.to }, 'Failed to send email')
      throw error
    }
  }

  async sendVerificationEmail(
    email: string,
    name: string,
    token: string,
    verificationUrl: string
  ): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { 
            display: inline-block; 
            padding: 12px 30px; 
            background-color: #007bff; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
          }
          .footer { margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Welcome, ${name}!</h2>
          <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
          <p>
            <a href="${verificationUrl}" class="button">Verify Email</a>
          </p>
          <p>Or copy and paste this link in your browser:</p>
          <p><a href="${verificationUrl}">${verificationUrl}</a></p>
          <p>This link will expire in 24 hours.</p>
          <div class="footer">
            <p>If you didn't create an account, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `

    await this.send({
      to: email,
      subject: 'Verify your email address',
      html
    })
  }

  async sendPasswordResetEmail(
    email: string,
    name: string,
    token: string,
    resetUrl: string
  ): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { 
            display: inline-block; 
            padding: 12px 30px; 
            background-color: #dc3545; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
          }
          .footer { margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Password Reset Request</h2>
          <p>Hello ${name},</p>
          <p>We received a request to reset your password. Click the button below to proceed:</p>
          <p>
            <a href="${resetUrl}" class="button">Reset Password</a>
          </p>
          <p>Or copy and paste this link in your browser:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>This link will expire in 1 hour.</p>
          <div class="footer">
            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
          </div>
        </div>
      </body>
      </html>
    `

    await this.send({
      to: email,
      subject: 'Reset your password',
      html
    })
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Welcome to our platform!</h2>
          <p>Hello ${name},</p>
          <p>Your email has been verified successfully. You now have full access to all features.</p>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Best regards,<br>The Team</p>
        </div>
      </body>
      </html>
    `

    await this.send({
      to: email,
      subject: 'Welcome!',
      html
    })
  }

  async sendPasswordChangedEmail(email: string, name: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Password Changed Successfully</h2>
          <p>Hello ${name},</p>
          <p>This is a confirmation that your password has been changed successfully.</p>
          <p>If you didn't make this change, please contact our support team immediately.</p>
          <p>Best regards,<br>The Team</p>
        </div>
      </body>
      </html>
    `

    await this.send({
      to: email,
      subject: 'Password Changed',
      html
    })
  }
}