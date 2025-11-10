import jwt from 'jsonwebtoken'
import { TokenGeneratorPort, type TokenPayload } from '@/application/ports'
import { CustomError } from '@/domain/errors'
import { environments } from '../config/environments'

export class JwtGeneratorAdapter implements TokenGeneratorPort {
  private readonly jwtSecret: string = environments.JWT_SECRET
  private readonly jwtRefreshSecret: string = environments.JWT_REFRESH_SECRET

  constructor() {
    if ( !this.jwtSecret ) {
      throw CustomError.internalServer('JWT_SECRET is not defined')
    }
  }

  async generateToken(payload: TokenPayload, duration: string = '1h'): Promise<string> {

    const jwtOptions: jwt.SignOptions = { expiresIn: duration as jwt.SignOptions['expiresIn'] }
    return new Promise( ( resolve, reject ) => {
      jwt.sign( payload, this.jwtSecret, jwtOptions, ( err, token ) => {
        if ( err ) return reject( err )
        resolve( token! )
      } )
    } )
  }

  async validateToken<T>( token: string ): Promise<T | null> {
    return new Promise( ( resolve ) => {
      jwt.verify( token, this.jwtSecret, ( err, decoded ) => {
        if ( err ) return resolve( null )
        resolve( decoded as T )
      } )
    } )
  }
}