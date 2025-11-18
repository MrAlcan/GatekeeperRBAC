import { config } from 'dotenv'
import { z } from 'zod'

config()

const envSchema = z.object({
  PORT: z.string().transform(Number).pipe(z.number().positive()),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_ACCESS_EXPIRATION: z.string().default('15m'),
  JWT_REFRESH_EXPIRATION: z.string().default('7d'),

  DATABASE_URL: z.string().url(),

  EMAIL_HOST: z.string().optional(),
  EMAIL_PORT: z.string().transform(Number).pipe(z.number().positive()).optional(),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASS: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),

  FRONTEND_URL: z.string().url().default('http://localhost:3001'),
  API_URL: z.string().url().default('http://localhost:3000'),

  BCRYPT_ROUNDS: z.string().transform(Number).pipe(z.number().min(8).max(15)).default(10),
  MAX_LOGIN_ATTEMPTS: z.string().transform(Number).pipe(z.number().positive()).default(5),
  LOCKOUT_DURATION: z.string().transform(Number).pipe(z.number().positive()).default(15),

  RATE_LIMIT_WINDOW: z.string().transform(Number).pipe(z.number().positive()).default(15),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).pipe(z.number().positive()).default(100)
})

type Env = z.infer<typeof envSchema>

function parseEnv(): Env {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:')
      error.issues.forEach((err: any) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`)
      })
    }
    console.error('\n💡 Check your .env file and make sure all required variables are set.')
    process.exit(1)
  }
}

const env = parseEnv()

export const environments = {
  PORT: env.PORT,
  NODE_ENV: env.NODE_ENV,
  LOG_LEVEL: env.LOG_LEVEL,

  JWT_SECRET: env.JWT_SECRET,
  JWT_REFRESH_SECRET: env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRATION: env.JWT_ACCESS_EXPIRATION,
  JWT_REFRESH_EXPIRATION: env.JWT_REFRESH_EXPIRATION,

  DATABASE_URL: env.DATABASE_URL,
  POSTGRES_DB_HOST: process.env.POSTGRES_DB_HOST || 'localhost',
  POSTGRES_DB_PORT: parseInt(process.env.POSTGRES_DB_PORT || '5432', 10),
  POSTGRES_DB_USER: process.env.POSTGRES_DB_USER || 'postgres',
  POSTGRES_DB_PASS: process.env.POSTGRES_DB_PASS || 'postgres',
  POSTGRES_DB_NAME: process.env.POSTGRES_DB_NAME || 'rbac_db',

  EMAIL_HOST: env.EMAIL_HOST,
  EMAIL_PORT: env.EMAIL_PORT,
  EMAIL_USER: env.EMAIL_USER,
  EMAIL_PASS: env.EMAIL_PASS,
  EMAIL_FROM: env.EMAIL_FROM || 'noreply@example.com',

  FRONTEND_URL: env.FRONTEND_URL,
  API_URL: env.API_URL,

  BCRYPT_ROUNDS: env.BCRYPT_ROUNDS,
  MAX_LOGIN_ATTEMPTS: env.MAX_LOGIN_ATTEMPTS,
  LOCKOUT_DURATION: env.LOCKOUT_DURATION,

  RATE_LIMIT_WINDOW: env.RATE_LIMIT_WINDOW,
  RATE_LIMIT_MAX_REQUESTS: env.RATE_LIMIT_MAX_REQUESTS
} as const

export function validateConfig(): void {
  console.log('🔧 Validating configuration...')

  if (environments.NODE_ENV === 'production') {
    if (!environments.EMAIL_HOST || !environments.EMAIL_PORT) {
      console.warn('⚠️  Warning: Email not configured in production')
    }
  }

  console.log('✅ Configuration validated')
  console.log(`🌍 Environment: ${environments.NODE_ENV}`)
  console.log(`🚀 Port: ${environments.PORT}`)
  console.log(`📝 Log Level: ${environments.LOG_LEVEL}`)
}

export const isDevelopment = environments.NODE_ENV === 'development'

export const isProduction = environments.NODE_ENV === 'production'

export const isTest = environments.NODE_ENV === 'test'