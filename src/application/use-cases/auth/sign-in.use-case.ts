import type { SignInDto } from '@/domain/dtos'
import type { UserEntity } from '@/domain/entities'
import type { AuthRepository } from '@/domain/repositories'
import { CustomError } from '@/domain/errors'

export interface SignInResponseDto {
  success: boolean
  data: UserEntity
  token: string
}

export class SignInUseCase {
  constructor (
    private readonly authRepository: AuthRepository
  ) {}
  async execute ( signInDto: SignInDto ): Promise<SignInResponseDto> {
    const user = await this.authRepository.signIn( signInDto )
    if ( !user ) {
      throw CustomError.notFound( 'errors.signIn.user.notFound' )
    }
    const token = this.createToken( user )
    return { success: true, data: user, token }
  }

  private createToken ( user: UserEntity ): string {
    return 'token'
  }
}