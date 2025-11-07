import { CustomError } from '@/domain/errors'
import { EmailVO } from '@/domain/value-objects/email.value-object'

export class SignInDto {
  private constructor (
    public email: EmailVO,
    public password: string,
  ) {}

  static create ( object: Record<string, any> ): SignInDto {

    if ( !object ) {
      throw CustomError.badRequest( 'errors.signIn.requestBody.required' )
    }

    const { email, password } = object

    if ( !email ) {
      throw CustomError.badRequest( 'errors.signIn.email.required' )
    }

    if ( !password ) {
      throw CustomError.badRequest( 'errors.signIn.password.required' )
    }

    const emailVO = EmailVO.create( email )
    const passwordStr = password.trim()
    return new SignInDto( emailVO, passwordStr )
  }
}