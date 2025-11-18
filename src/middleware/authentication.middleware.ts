import type { Request, Response, NextFunction } from 'express'
import { AuthenticationError } from '@/domain/errors'
import { JwtGeneratorAdapter } from '@/infrastructure/adapters'
import { EntityIdVO } from '@/domain/value-objects'
import { RoleEntity } from '@/domain/entities'
import { EmailVO } from '@/domain/value-objects'
import type { AccessTokenPayload } from '@/application/ports'

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      throw AuthenticationError.tokenMissing()
    }

    const jwtGenerator = new JwtGeneratorAdapter()
    const payload = await jwtGenerator.validateAccessToken(token)

    if (!payload) {
      throw AuthenticationError.tokenInvalid()
    }

    req.user = {
      userId: payload.userId,
      email: payload.email,
      roles: payload.roles
    }

    next()
  } catch (error) {
    next(error)
  }
}

export const optionalAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.replace('Bearer ', '')

    if (token) {
      const jwtGenerator = new JwtGeneratorAdapter()
      const payload = await jwtGenerator.validateAccessToken(token)

      if (payload) {
        req.user = {
          userId: payload.userId,
          email: payload.email,
          roles: payload.roles
        }
      }
    }

    next()
  } catch (error) {
    next()
  }
}