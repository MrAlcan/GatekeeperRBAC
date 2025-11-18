import { Router } from 'express'
import { AuthController } from './controllers'
import {
  validateBody,
  authenticate,
  strictRateLimiter,
  apiRateLimiter
} from '../../middleware'
import {
  SignInSchema,
  RefreshTokenSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  ChangePasswordSchema,
  VerifyEmailSchema
} from '@/domain/schemas'

export class AuthRoutes {
  static get routes(): Router {
    const router = Router()

    router.post(
      '/sign-in',
      strictRateLimiter,
      validateBody(SignInSchema),
      AuthController.signIn
    )

    router.post(
      '/forgot-password',
      strictRateLimiter,
      validateBody(ForgotPasswordSchema),
      AuthController.forgotPassword
    )

    router.post(
      '/reset-password',
      strictRateLimiter,
      validateBody(ResetPasswordSchema),
      AuthController.resetPassword
    )

    router.post(
      '/verify-email',
      apiRateLimiter,
      validateBody(VerifyEmailSchema),
      AuthController.verifyEmail
    )

    router.post(
      '/refresh',
      apiRateLimiter,
      AuthController.refreshToken
    )

    router.post(
      '/sign-out',
      authenticate,
      AuthController.signOut
    )

    router.post(
      '/change-password',
      authenticate,
      validateBody(ChangePasswordSchema),
      AuthController.changePassword
    )

    router.get(
      '/me',
      authenticate,
      AuthController.getMe
    )

    router.get(
      '/me/permissions',
      authenticate,
      AuthController.getMyPermissions
    )

    return router
  }
}