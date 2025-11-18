declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string
    NODE_ENV: 'development' | 'production' | 'test'
    LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error'
  }
}
