//import 'module-alias/register' // Para usar alias de paths
import { environments, validateConfig } from '@/infrastructure/config'
import { Server } from '@/presentation'
import { AppRoutes } from '@/presentation/routes'
import { connectPrisma, disconnectPrisma } from '@/infrastructure/data/prisma'
import logger from '@/logger'

class Application {
  private server?: Server

  async initialize(): Promise<void> {
    try {
      console.log('🔧 Initializing application...')
      validateConfig()

      await this.connectDatabase()

      this.server = new Server({
        port: environments.PORT,
        routes: AppRoutes.routes
      })

      await this.server.start()

      this.setupGracefulShutdown()

      logger.info('✅ Application initialized successfully')
    } catch (error) {
      logger.error({ error }, '❌ Failed to initialize application')
      process.exit(1)
    }
  }

  private async connectDatabase(): Promise<void> {
    try {
      console.log('📦 Connecting to database...')
      await connectPrisma()
      logger.info('✅ Database connected')
    } catch (error) {
      logger.error({ error }, '❌ Failed to connect to database')
      throw error
    }
  }

  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received, shutting down gracefully...`)

      try {
        if (this.server) {
          await this.server.stop()
        }
        await disconnectPrisma()

        logger.info('✅ Shutdown completed')
        process.exit(0)
      } catch (error) {
        logger.error({ error }, '❌ Error during shutdown')
        process.exit(1)
      }
    }

    process.on('SIGTERM', () => shutdown('SIGTERM'))
    process.on('SIGINT', () => shutdown('SIGINT'))

    process.on('uncaughtException', (error) => {
      logger.error({ error }, '❌ Uncaught Exception')
      process.exit(1)
    })

    process.on('unhandledRejection', (reason, promise) => {
      logger.error({ reason, promise }, '❌ Unhandled Rejection')
      process.exit(1)
    })
  }
}

const app = new Application()
app.initialize()