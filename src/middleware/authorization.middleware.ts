import type { Request, Response, NextFunction } from 'express'
import { AuthorizationError, AuthenticationError } from '@/domain/errors'
import { AuthRepositoryImpl } from '@/infrastructure/repositories'
import { AuthDatasourceImpl } from '@/infrastructure/datasource'
import { EntityIdVO } from '@/domain/value-objects'

export const authorize = (...permissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw AuthenticationError.tokenMissing()
      }

      if (permissions.length === 0) {
        return next()
      }
      const authRepository = new AuthRepositoryImpl()
      const userIdVO = EntityIdVO.create( req.user.userId )
      const userPermissions = await authRepository.getUserPermissions(
        userIdVO
      )
      const hasPermission = permissions.some(permission =>
        userPermissions.includes(permission) ||
        userPermissions.includes(`${permission.split(':')[0]}:manage`)
      )

      if (!hasPermission) {
        throw AuthorizationError.insufficientPermissions(
          permissions,
          req.path
        )
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}

export const requireAllPermissions = (...permissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw AuthenticationError.tokenMissing()
      }

      if (permissions.length === 0) {
        return next()
      }

      const authRepository = new AuthRepositoryImpl()
      const userPermissions = await authRepository.getUserPermissions(
        EntityIdVO.create(req.user.userId)
      )

      const hasAllPermissions = permissions.every(permission =>
        userPermissions.includes(permission) ||
        userPermissions.includes(`${permission.split(':')[0]}:manage`)
      )

      if (!hasAllPermissions) {
        throw AuthorizationError.insufficientPermissions(
          permissions,
          req.path
        )
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw AuthenticationError.tokenMissing()
      }

      if (roles.length === 0) {
        return next()
      }

      const hasRole = roles.some(role =>
        req.user!.roles.map(r => r.toLowerCase()).includes(role.toLowerCase())
      )

      if (!hasRole) {
        throw AuthorizationError.roleRequired(roles.join(' or '))
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}