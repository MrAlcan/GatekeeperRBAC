import { PrismaClient } from '@prisma/client'
import logger from '@/logger'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      { level: 'error', emit: 'stdout' },
      { level: 'warn', emit: 'stdout' },
    ],
  })

if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e: any) => {
    logger.debug(
      {
        query: e.query,
        params: e.params,
        duration: `${e.duration}ms`
      },
      'Prisma Query'
    )
  })
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export const disconnectPrisma = async () => {
  await prisma.$disconnect()
}

export const connectPrisma = async () => {
  await prisma.$connect()
}