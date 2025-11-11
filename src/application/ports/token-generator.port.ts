export interface AccessTokenPayload {
  userId: string
  email: string
  roles: string[]
}

export interface RefreshTokenPayload {
  userId: string
  tokenId: string
}

export abstract class TokenGeneratorPort {
  abstract generateAccessToken(
    payload: AccessTokenPayload,
    expiresIn?: string
  ): Promise<string>

  abstract generateRefreshToken(
    payload: RefreshTokenPayload,
    expiresIn?: string
  ): Promise<string>

  abstract validateAccessToken(
    token: string
  ): Promise<AccessTokenPayload | null>

  abstract validateRefreshToken(
    token: string
  ): Promise<RefreshTokenPayload | null>

  abstract decodeToken<T = any>( token: string ): T | null
}