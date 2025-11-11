import { ValidationError } from '@/domain/errors/validation.error'

export class EmailVO {
  private readonly _value: string

  private constructor( email: string ) {
    this._value = email.toLowerCase().trim()
  }

  get value(): string {
    return this._value
  }

  public static create( email: string ): EmailVO {
    if ( !email ) {
      throw ValidationError.singleField(
        'email',
        'REQUIRED',
        'Email is required'
      )
    }

    const trimmed = email.trim()
    if ( !this.isValid( trimmed ) ) {
      throw ValidationError.singleField(
        'email',
        'INVALID_FORMAT',
        'Email format is invalid',
        email
      )
    }

    return new EmailVO( trimmed )
  }

  private static isValid( email: string ): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test( email ) && email.length <= 255
  }

  equals( other: EmailVO ): boolean {
    return this._value === other._value
  }

  toString(): string {
    return this._value
  }

  toJSON(): string {
    return this._value
  }

  getDomain(): string {
    return this._value.split( '@' )[ 1 ]
  }

  getLocalPart(): string {
    return this._value.split( '@' )[ 0 ]
  }

  isFromDomain( domain: string ): boolean {
    return this.getDomain().toLowerCase() === domain.toLowerCase()
  }
}