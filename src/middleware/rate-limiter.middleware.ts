import type { Request, Response, NextFunction } from 'express'
import { environments } from '@/infrastructure/config'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

setInterval(() => {
  const now = Date.now()
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  })
}, 60000)

export interface RateLimiterOptions {
  windowMs?: number
  maxRequests?: number
  message?: string
  skipSuccessfulRequests?: boolean
}

export const rateLimiter = (options: RateLimiterOptions = {}) => {
  const {
    windowMs = environments.RATE_LIMIT_WINDOW * 60 * 1000,
    maxRequests = environments.RATE_LIMIT_MAX_REQUESTS,
    message = 'Too many requests, please try again later',
    skipSuccessfulRequests = false
  } = options

  return (req: Request, res: Response, next: NextFunction) => {
    const identifier = req.user
      ? `${req.context.ipAddress}:${req.user.userId}`
      : req.context.ipAddress

    const now = Date.now()
    const resetTime = now + windowMs

    if (!store[identifier] || store[identifier].resetTime < now) {
      store[identifier] = {
        count: 0,
        resetTime
      }
    }

    store[identifier].count++

    res.setHeader('X-RateLimit-Limit', maxRequests)
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - store[identifier].count))
    res.setHeader('X-RateLimit-Reset', new Date(store[identifier].resetTime).toISOString())
    if (store[identifier].count > maxRequests) {
      res.setHeader('Retry-After', Math.ceil((store[identifier].resetTime - now) / 1000))

      return res.status(429).json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message,
          statusCode: 429,
          retryAfter: Math.ceil((store[identifier].resetTime - now) / 1000)
        }
      })
    }

    if (skipSuccessfulRequests) {
      res.on('finish', () => {
        if (res.statusCode < 400) {
          store[identifier].count--
        }
      })
    }

    next()
  }
}

export const strictRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
  message: 'Too many attempts, please try again later'
})

export const apiRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 100
})