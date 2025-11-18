import type { Logger } from 'pino'

declare global {
  namespace Express {
    interface Request {
      log: Logger
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

export {}