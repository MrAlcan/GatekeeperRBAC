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
    if ( !name )
      throw CustomError.badRequest( 'errors.createUser.name.required' )

    if ( name && typeof name !== 'string' )
      throw CustomError.badRequest( 'errors.createUser.name.string' )

    if ( !lastName )
      throw CustomError.badRequest( 'errors.createUser.lastName.required' )

    if ( lastName && typeof lastName !== 'string' )
      throw CustomError.badRequest( 'errors.createUser.lastName.string' )

    if ( !email )
      throw CustomError.badRequest( 'errors.createUser.email.required' )

    if ( email && typeof email !== 'string' )
      throw CustomError.badRequest( 'errors.createUser.email.string' )

    if ( !password )
      throw CustomError.badRequest( 'errors.createUser.password.required' )

    if ( password && typeof password !== 'string' )
      throw CustomError.badRequest( 'errors.createUser.password.string' )

    if ( roleNames && !Array.isArray( roleNames ) )
      throw CustomError.badRequest( 'errors.createUser.roleNames.array' )

    const nameStr: string = name.trim()
    const lastNameStr: string = lastName.trim()
    const emailStr: string = email.trim()
    const emailVO: EmailVO = EmailVO.create( emailStr )
    const passwordStr: string = password.trim()
    return new CreateUserDto( nameStr, lastNameStr, emailVO, passwordStr, roleNames )
  }
}