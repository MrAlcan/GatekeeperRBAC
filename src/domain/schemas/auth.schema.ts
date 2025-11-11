import { z } from 'zod'
import { EmailSchema, PasswordSchema, UUIDSchema } from './common.schema'

export const SignInSchema = z.object({
  email: EmailSchema,
  password: z.string().min( 1, 'Password is required' )
})

export type SignInInput = z.infer<typeof SignInSchema>

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min( 1, 'Refresh token is required' )
})

export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>

export const ForgotPasswordSchema = z.object({
  email: EmailSchema
})

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>

export const ResetPasswordSchema = z.object({
  token: z.string().min( 1, 'Token is required' ),
  password: PasswordSchema,
  confirmPassword: PasswordSchema
}).refine( data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: [ 'confirmPassword' ]
})

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min( 1, 'Current password is required' ),
  newPassword: PasswordSchema,
  confirmPassword: PasswordSchema
}).refine( data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: [ 'confirmPassword' ]
}).refine( data => data.currentPassword !== data.newPassword, {
  message: 'New password must be different from current password',
  path: [ 'newPassword' ]
})

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>

export const VerifyEmailSchema = z.object({
  token: z.string().min( 1, 'Verification token is required' )
})

export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>

export const GetMyPermissionsSchema = z.object({
  userId: UUIDSchema
})

export type GetMyPermissionsInput = z.infer<typeof GetMyPermissionsSchema>