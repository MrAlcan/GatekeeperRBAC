import type { Request, Response, NextFunction } from 'express'
import {
  SignInUseCase,
  SignOutUseCase,
  RefreshTokenUseCase,
  ForgotPasswordUseCase,
  ResetPasswordUseCase,
  ChangePasswordUseCase,
  VerifyEmailUseCase,
  GetMyPermissionsUseCase
} from '@/application/use-cases'
import {
  AuthRepositoryImpl,
  RefreshTokenRepositoryImpl,
  UsersRepositoryImpl
} from '@/infrastructure/repositories'
import {
  JwtGeneratorAdapter,
  BcryptHasherAdapter,
  NodemailerSenderAdapter,
  AuditLoggerAdapter
} from '@/infrastructure/adapters'
import { AuditLogRepositoryImpl } from '@/infrastructure/repositories'
import { environments } from '@/infrastructure/config'

export class AuthController {

  static signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authRepository = new AuthRepositoryImpl()
      const refreshTokenRepository = new RefreshTokenRepositoryImpl()
      const tokenGenerator = new JwtGeneratorAdapter()
      const passwordHasher = new BcryptHasherAdapter()
      const auditLogRepository = new AuditLogRepositoryImpl()
      const auditLogger = new AuditLoggerAdapter(auditLogRepository)

      const useCase = new SignInUseCase(
        authRepository,
        refreshTokenRepository,
        tokenGenerator,
        passwordHasher,
        auditLogger
      )

      const result = await useCase.execute(req.body, {
        ipAddress: req.context.ipAddress,
        userAgent: req.context.userAgent
      })

      res.cookie('accessToken', result.data.accessToken, {
        httpOnly: true,
        secure: environments.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
      })

      res.cookie('refreshToken', result.data.refreshToken, {
        httpOnly: true,
        secure: environments.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/api/v1/auth/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })

      res.status(200).json({
        success: true,
        data: {
          user: result.data.user
        }
      })
    } catch (error) {
      next(error)
    }
  }

  static signOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshTokenRepository = new RefreshTokenRepositoryImpl()
      const auditLogRepository = new AuditLogRepositoryImpl()
      const auditLogger = new AuditLoggerAdapter(auditLogRepository)

      const useCase = new SignOutUseCase(
        refreshTokenRepository,
        auditLogger
      )

      const result = await useCase.execute(
        req.user!.userId,
        req.cookies?.refreshToken,
        {
          ipAddress: req.context.ipAddress,
          userAgent: req.context.userAgent
        }
      )

      res.clearCookie('accessToken')
      res.clearCookie('refreshToken', { path: '/api/v1/auth/refresh' })

      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  static refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body.refreshToken

      const refreshTokenRepository = new RefreshTokenRepositoryImpl()
      const authRepository = new AuthRepositoryImpl()
      const tokenGenerator = new JwtGeneratorAdapter()
      const auditLogRepository = new AuditLogRepositoryImpl()
      const auditLogger = new AuditLoggerAdapter(auditLogRepository)

      const useCase = new RefreshTokenUseCase(
        refreshTokenRepository,
        authRepository,
        tokenGenerator,
        auditLogger
      )

      const result = await useCase.execute(
        { refreshToken },
        {
          ipAddress: req.context.ipAddress,
          userAgent: req.context.userAgent
        }
      )

      res.cookie('accessToken', result.data.accessToken, {
        httpOnly: true,
        secure: environments.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
      })

      res.cookie('refreshToken', result.data.refreshToken, {
        httpOnly: true,
        secure: environments.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/api/v1/auth/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })

      res.status(200).json({ success: true })
    } catch (error) {
      next(error)
    }
  }

  static forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authRepository = new AuthRepositoryImpl()
      const emailSender = new NodemailerSenderAdapter()

      const useCase = new ForgotPasswordUseCase(
        authRepository,
        emailSender
      )

      const result = await useCase.execute(
        req.body,
        environments.FRONTEND_URL
      )

      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  static resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authRepository = new AuthRepositoryImpl()
      const passwordHasher = new BcryptHasherAdapter()
      const emailSender = new NodemailerSenderAdapter()
      const auditLogRepository = new AuditLogRepositoryImpl()
      const auditLogger = new AuditLoggerAdapter(auditLogRepository)

      const useCase = new ResetPasswordUseCase(
        authRepository,
        passwordHasher,
        emailSender,
        auditLogger
      )

      const result = await useCase.execute(req.body, {
        ipAddress: req.context.ipAddress,
        userAgent: req.context.userAgent
      })

      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  static changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authRepository = new AuthRepositoryImpl()
      const passwordHasher = new BcryptHasherAdapter()
      const emailSender = new NodemailerSenderAdapter()
      const auditLogRepository = new AuditLogRepositoryImpl()
      const auditLogger = new AuditLoggerAdapter(auditLogRepository)

      const useCase = new ChangePasswordUseCase(
        authRepository,
        passwordHasher,
        emailSender,
        auditLogger
      )

      const result = await useCase.execute(
        req.user!.userId,
        req.body,
        {
          ipAddress: req.context.ipAddress,
          userAgent: req.context.userAgent
        }
      )

      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  static verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authRepository = new AuthRepositoryImpl()
      const emailSender = new NodemailerSenderAdapter()
      const auditLogRepository = new AuditLogRepositoryImpl()
      const auditLogger = new AuditLoggerAdapter(auditLogRepository)

      const useCase = new VerifyEmailUseCase(
        authRepository,
        emailSender,
        auditLogger
      )

      const result = await useCase.execute(req.body, {
        ipAddress: req.context.ipAddress,
        userAgent: req.context.userAgent
      })

      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  static getMyPermissions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authRepository = new AuthRepositoryImpl()

      const useCase = new GetMyPermissionsUseCase(authRepository)

      const result = await useCase.execute(req.user!.userId)

      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  static getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const usersRepository = new UsersRepositoryImpl()
      const { GetUserByIdUseCase } = await import('@/application/use-cases')

      const useCase = new GetUserByIdUseCase(usersRepository)

      const result = await useCase.execute({ id: req.user!.userId })

      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }
}