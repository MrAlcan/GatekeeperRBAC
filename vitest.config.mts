import { defineConfig } from 'vitest/config'
import path from 'path'
import { loadEnvFile } from 'process'

loadEnvFile( path.resolve( __dirname, './.test.env' ) )
export default defineConfig({
  test: {
    env: {
      PORT: process.env.PORT,
      JWT_SECRET: process.env.JWT_SECRET,
    },
    typecheck: {
      enabled: true,
    },
    coverage: {
      enabled: true,
      provider: 'istanbul',
    },
    alias: {
      '@': path.resolve( __dirname, './src' ),
    },
  }
})
