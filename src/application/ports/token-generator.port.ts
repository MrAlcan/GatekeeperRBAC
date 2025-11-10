export interface TokenPayload {
  id: string
  roles?: string[]
}

/*export interface TokenGeneratorPort {
  generateToken(payload: TokenPayload, duration?: string): Promise<string>
}*/

export abstract class TokenGeneratorPort {
  abstract generateToken( payload: TokenPayload, duration?: string ): Promise<string>
  abstract validateToken<T>( token: string ): Promise<T | null>
}
