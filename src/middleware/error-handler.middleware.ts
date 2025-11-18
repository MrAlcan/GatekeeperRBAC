import type { Request, Response, NextFunction } from 'express'
import { BaseError } from '@/domain/errors'
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library'
import { environments } from '@/infrastructure/config'
import logger from '@/logger'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(
    {
      err,
      requestId: req.requestId,
      path: req.path,
      method: req.method,
      user: req.user?.userId,
      ip: req.context?.ipAddress
    },
    'Request error'
  )

  if (err instanceof BaseError) {
    return res.status(err.statusCode).json(err.toJSON())
  }
  if (err instanceof PrismaClientKnownRequestError) {
    return handlePrismaError(err, res)
  }

  if (err instanceof PrismaClientValidationError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid data provided',
        statusCode: 400
      }
    })
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: {
        code: 'TOKEN_INVALID',
        message: 'Invalid token',
        statusCode: 401
      }
    })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: {
        code: 'TOKEN_EXPIRED',
        message: 'Token has expired',
        statusCode: 401
      }
    })
  }

  const isDevelopment = environments.NODE_ENV === 'development'

  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: isDevelopment ? err.message : 'An unexpected error occurred',
      statusCode: 500,
      ...(isDevelopment && { stack: err.stack })
    }
  })
}

function handlePrismaError(
  err: PrismaClientKnownRequestError,
  res: Response
) {
  switch (err.code) {
    case 'P2002':
      const target = (err.meta?.target as string[]) || []
      return res.status(409).json({
        error: {
          code: 'DUPLICATE_ENTRY',
          message: `${target.join(', ')} already exists`,
          statusCode: 409
        }
      })

    case 'P2003':
      return res.status(400).json({
        error: {
          code: 'FOREIGN_KEY_CONSTRAINT',
          message: 'Related record not found',
          statusCode: 400
        }
      })

    case 'P2025':
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Record not found',
          statusCode: 404
        }
      })

    default:
      return res.status(500).json({
        error: {
          code: 'DATABASE_ERROR',
          message: 'Database operation failed',
          statusCode: 500
        }
      })
  }
}

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
      statusCode: 404
    }
  })
}