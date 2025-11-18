import type { Request, Response, NextFunction } from 'express'

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now()

  req.log = req.log.child({
    requestId: req.requestId,
    userId: req.user?.userId,
    ip: req.context?.ipAddress
  })

  req.log.info(
    {
      method: req.method,
      url: req.originalUrl,
      userAgent: req.context?.userAgent
    },
    'Request started'
  )

  res.on('finish', () => {
    const duration = Date.now() - start
    const level = res.statusCode >= 500 ? 'error'
                : res.statusCode >= 400 ? 'warn'
                : 'info'

    req.log[level](
      {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration: `${duration}ms`
      },
      'Request completed'
    )
  })

  next()
}