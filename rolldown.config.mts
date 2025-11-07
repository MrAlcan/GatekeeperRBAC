import { defineConfig } from 'rolldown'
import path from 'path'

const projectRootDir = path.resolve( __dirname )

export default defineConfig({
  input: 'src/app.ts',
  output: {
    format: 'esm',
    dir: 'dist'
  },
  resolve: {
    alias: {
      '@': path.resolve( projectRootDir, 'src' )
    }
  },
  external: [
    'express',
    'pdf-lib',
    'pg',
    'qrcode',
    'nodemailer',
    'pino',
    'pino-http',
  ],
})
