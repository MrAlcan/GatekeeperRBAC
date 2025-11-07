import { CustomError } from '@/domain/errors/custom.error'

export class EmailVO {
  public readonly value: string

  private constructor( email: string ) {
    this.value = email.toLowerCase().trim()
  }

  public static create( email: string ): EmailVO {
    if ( !this.isValid( email ) ) {
      throw CustomError.badRequest( 'Invalid email format', [{
        field: 'email',
        code: 'invalid_email_format',
        messageKey: 'invalid_email_format',
      }] )
    }
    return new EmailVO( email )
  }

  private static isValid( email: string ): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test( email )
  }
}