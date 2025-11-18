import express, { type Application, type Router } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import compression from 'compression'
import pinoHttp from 'pino-http'
import logger from '@/logger'
import { environments } from '@/infrastructure/config'
import { AppRoutes } from './routes'
import {
  contextMiddleware,
  errorHandler,
  notFoundHandler
} from '../middleware'

interface ServerOptions {
  port: number
  routes: Router
}

export class Server {
  private readonly app: Application
  private readonly port: number

  constructor(options: ServerOptions) {
    this.app = express()
    this.port = options.port

    this.configureMiddlewares()
    this.configureRoutes(options.routes)
    this.configureErrorHandlers()
  }

  private configureMiddlewares(): void {
    this.app.use(
      cors({
        origin: environments.FRONTEND_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization']
      })
    )

    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:']
          }
        },
        crossOriginEmbedderPolicy: false
      })
    )

    this.app.use(compression())

    this.app.use(cookieParser())

    this.app.use(express.json({ limit: '10mb' }))
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }))

    this.app.use(
      pinoHttp({
        logger,
        customLogLevel: (req, res, err) => {
          if (res.statusCode >= 500) return 'error'
          if (res.statusCode >= 400) return 'warn'
          return 'info'
        },
        customSuccessMessage: (req, res) => {
          return `${req.method} ${req.url} completed`
        },
        customErrorMessage: (req, res, err) => {
          return `${req.method} ${req.url} failed: ${err.message}`
        }
      })
    )

    this.app.use(contextMiddleware)

    this.app.set('trust proxy', 1)
  }

  private configureRoutes(routes: Router): void {
    this.app.use( routes )
  }

  private configureErrorHandlers(): void {
    this.app.use(notFoundHandler)
    this.app.use(errorHandler)
  }

  async start(): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(this.port, () => {
        console.log('')
        console.log('╔════════════════════════════════════════════╗')
        console.log('║                                            ║')
        console.log('║        🚀 RBAC System - API Server        ║')
        console.log('║                                            ║')
        console.log('╠════════════════════════════════════════════╣')
        console.log(`║  Port:        ${this.port.toString().padEnd(30)} ║`)
        console.log(`║  Environment: ${environments.NODE_ENV.padEnd(30)} ║`)
        console.log(`║  Log Level:   ${environments.LOG_LEVEL.padEnd(30)} ║`)
        console.log('╠════════════════════════════════════════════╣')
        console.log(`║  Health:      http://localhost:${this.port}/health`)
        console.log(`║  API Docs:    http://localhost:${this.port}/api/v1`)
        console.log('╚════════════════════════════════════════════╝')
        console.log('')

        logger.info(
          {
            port: this.port,
            env: environments.NODE_ENV,
            nodeVersion: process.version
          },
          'Server started successfully'
        )

        resolve()
      })
    })
  }

  async stop(): Promise<void> {
    return new Promise((resolve) => {
      logger.info('Shutting down server...')
      process.exit(0)
    })
  }

  getApp(): Application {
    return this.app
  }
}