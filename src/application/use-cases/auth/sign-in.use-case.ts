import type { SignInDto } from '@/domain/dtos'
import type { UserEntity } from '@/domain/entities'
import type { AuthRepository } from '@/domain/repositories'
import { CustomError } from '@/domain/errors'
import type { TokenGeneratorPort, TokenPayload } from '@/application/ports'

export interface SignInResponseDto {
  success: boolean
  data: UserEntity
  token: string
}

export class SignInUseCase {
  constructor (
    private readonly authRepository: AuthRepository,
    private readonly tokenGeneratorPort: TokenGeneratorPort
  ) {}
  async execute ( signInDto: SignInDto ): Promise<SignInResponseDto> {
    const user = await this.authRepository.signIn( signInDto )
    if ( !user ) {
      throw CustomError.notFound( 'errors.signIn.user.notFound' )
    }
    const token = await this.createToken( user )
    return { success: true, data: user, token }
  }

  private createToken ( user: UserEntity ): Promise<string> {
    const payload: TokenPayload = {
      id: user.id.value,
      roles: user.roles.map( role => role.name )
    }
    const token = this.tokenGeneratorPort.generateToken( payload )
    return token
  }
}