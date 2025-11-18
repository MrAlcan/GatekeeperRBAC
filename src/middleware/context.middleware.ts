import type { Request, Response, NextFunction } from 'express'
import { randomUUID } from 'crypto'

declare global {
  namespace Express {
    interface Request {
      requestId: string
      user?: {
        userId: string
        email: string
        roles: string[]
      }
      context: {
        ipAddress: string
        userAgent: string
      }
    }
  }
}

export const contextMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.requestId = randomUUID()

  const ipAddress = 
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    'unknown'

  const userAgent = req.headers['user-agent'] || 'unknown'

  req.context = {
    ipAddress,
    userAgent
  }

  res.setHeader('X-Request-ID', req.requestId)

  next()
}