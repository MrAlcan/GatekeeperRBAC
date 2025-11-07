import { CustomError } from '@/domain/errors'
import { EmailVO } from '@/domain/value-objects/email.value-object'

export class CreateUserDto {
  private constructor (
    public readonly name: string,
    public readonly lastName: string,
    public readonly email: EmailVO,
    public readonly password: string,
    public readonly roleNames?: string[],
  ) {}

  static create ( object: Record<string, any> ): CreateUserDto {
    if ( !object ) {
      throw CustomError.badRequest( 'errors.createUser.requestBody.required' )
    }
    const { name, lastName, email, password, roleNames } = object
    if ( !name ) {
      throw CustomError.badRequest( 'errors.createUser.name.required' )
    }
    if ( !lastName ) {
      throw CustomError.badRequest( 'errors.createUser.lastName.required' )
    }
    if ( !email ) {
      throw CustomError.badRequest( 'errors.createUser.email.required' )
    }
    if ( !password ) {
      throw CustomError.badRequest( 'errors.createUser.password.required' )
    }
    const nameStr = name.trim()
    const lastNameStr = lastName.trim()
    const emailStr = email.trim()
    const passwordStr = password.trim()
    return new CreateUserDto( nameStr, lastNameStr, emailStr, passwordStr, roleNames )
  }
}