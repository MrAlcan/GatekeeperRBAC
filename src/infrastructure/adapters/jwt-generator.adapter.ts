import jwt from 'jsonwebtoken'
import { TokenGeneratorPort, type AccessTokenPayload, type RefreshTokenPayload } from '@/application/ports'
import { environments } from '../config'

export class JwtGeneratorAdapter implements TokenGeneratorPort {
  private readonly accessTokenSecret: string
  private readonly refreshTokenSecret: string
  private readonly accessTokenExpiration: string = '15m'
  private readonly refreshTokenExpiration: string = '7d'

  constructor() {
    this.accessTokenSecret = environments.JWT_SECRET
    this.refreshTokenSecret = environments.JWT_REFRESH_SECRET

    if (!this.accessTokenSecret || !this.refreshTokenSecret) {
      throw new Error('JWT secrets are not configured')
    }
  }

  async generateAccessToken(
    payload: AccessTokenPayload,
    expiresIn?: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        this.accessTokenSecret,
        { expiresIn: expiresIn || this.accessTokenExpiration },
        (err, token) => {
          if (err || !token) return reject(err)
          resolve(token)
        }
      )
    })
  }

  async generateRefreshToken(
    payload: RefreshTokenPayload,
    expiresIn?: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        this.refreshTokenSecret,
        { expiresIn: expiresIn || this.refreshTokenExpiration },
        (err, token) => {
          if (err || !token) return reject(err)
          resolve(token)
        }
      )
    })
  }

  async validateAccessToken(token: string): Promise<AccessTokenPayload | null> {
    return new Promise((resolve) => {
      jwt.verify(token, this.accessTokenSecret, (err, decoded) => {
        if (err || !decoded) return resolve(null)
        resolve(decoded as AccessTokenPayload)
      })
    })
  }

  async validateRefreshToken(token: string): Promise<RefreshTokenPayload | null> {
    return new Promise((resolve) => {
      jwt.verify(token, this.refreshTokenSecret, (err, decoded) => {
        if (err || !decoded) return resolve(null)
        resolve(decoded as RefreshTokenPayload)
      })
    })
  }

  decodeToken<T = any>(token: string): T | null {
    try {
      return jwt.decode(token) as T
    } catch {
      return null
    }
  }
}