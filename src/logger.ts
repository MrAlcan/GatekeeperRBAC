import pino from 'pino'
import { environments } from '@/infrastructure/config'

const LOG_LEVEL = environments.LOG_LEVEL
const NODE_ENV = environments.NODE_ENV

let logger: pino.Logger

if ( NODE_ENV === 'development' ) {
  const transport = pino.transport({
    target: 'pino-pretty',
    options: { colorize: true, translateTime: 'SYS:standard' }
  });
  logger = pino( { level: LOG_LEVEL }, transport )
} else {
  logger = pino({ level: LOG_LEVEL })
}

export default logger
export type { pino } from 'pino'
