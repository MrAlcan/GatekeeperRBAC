
interface Environments {
  PORT: number
  JWT_SECRET: string
  JWT_REFRESH_SECRET: string
  POSTGRES_DB_HOST: string
  POSTGRES_DB_PORT: number
  POSTGRES_DB_USER: string
  POSTGRES_DB_PASS: string
  POSTGRES_DB_NAME: string
  EMAIL_HOST: string | undefined
  EMAIL_PORT: number | undefined
  EMAIL_FROM: string | undefined
  NODE_ENV: string
  LOG_LEVEL: string
}

export const environments: Environments = {
  PORT: ( process.env.PORT ) ? Number( process.env.PORT ) : 3000,
  JWT_SECRET: ( process.env.JWT_SECRET ) ? process.env.JWT_SECRET : 'secret',
  JWT_REFRESH_SECRET: ( process.env.JWT_REFRESH_SECRET ) ? process.env.JWT_REFRESH_SECRET : 'refresh',
  POSTGRES_DB_HOST: ( process.env.POSTGRES_DB_HOST ) ? process.env.POSTGRES_DB_HOST : 'localhost',
  POSTGRES_DB_PORT: ( process.env.POSTGRES_DB_PORT ) ? Number(process.env.POSTGRES_DB_PORT) : 5432,
  POSTGRES_DB_USER: ( process.env.POSTGRES_DB_USER ) ? process.env.POSTGRES_DB_USER : 'postgres',
  POSTGRES_DB_PASS: ( process.env.POSTGRES_DB_PASS ) ? process.env.POSTGRES_DB_PASS : 'postgres',
  POSTGRES_DB_NAME: ( process.env.POSTGRES_DB_NAME ) ? process.env.POSTGRES_DB_NAME : 'oep_rubio',
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: Number( process.env.EMAIL_PORT ),
  EMAIL_FROM: process.env.EMAIL_FROM,
  NODE_ENV: process.env.MODE ?? 'development',
  LOG_LEVEL: process.env.LOG_LEVEL,
}
console.log({ environments })
