import { ValidationError } from '../errors'
import { hash, compare } from 'bcryptjs'

export class PasswordVO {
  private readonly _value: string
  private readonly _isHashed: boolean

  private constructor( password: string, isHashed: boolean ) {
    this._value = password
    this._isHashed = isHashed
  }

  get value(): string {
    return this._value
  }

  get isHashed(): boolean {
    return this._isHashed
  }

  static createFromPlainText( password: string ): PasswordVO {
    if ( !password ) {
      throw ValidationError.singleField(
        'password',
        'REQUIRED',
        'Password is required'
      )
    }

    const errors: string[] = []

    if ( password.length < 8 ) {
      errors.push( 'Password must be at least 8 characters long' )
    }

    if ( password.length > 128 ) {
      errors.push( 'Password must not exceed 128 characters' )
    }

    if ( !/[a-z]/.test( password ) ) {
      errors.push( 'Password must contain at least one lowercase letter' )
    }

    if ( !/[A-Z]/.test( password ) ) {
      errors.push( 'Password must contain at least one uppercase letter' )
    }

    if ( !/\d/.test( password ) ) {
      errors.push( 'Password must contain at least one number' )
    }

    if ( !/[!@#$%^&*(),.?":{}|<>]/.test( password ) ) {
      errors.push( 'Password must contain at least one special character' )
    }

    if ( errors.length > 0 ) {
      throw ValidationError.singleField(
        'password',
        'WEAK_PASSWORD',
        errors.join('. ')
      )
    }

    return new PasswordVO( password, false )
  }

  static createFromHash( hash: string ): PasswordVO {
    if ( !hash ) {
      throw ValidationError.singleField(
        'password',
        'REQUIRED',
        'Password hash is required'
      )
    }

    if ( !hash.startsWith( '$2a$' ) && !hash.startsWith( '$2b$' ) && !hash.startsWith( '$2y$' ) ) {
      throw ValidationError.singleField(
        'password',
        'INVALID_HASH',
        'Invalid password hash format'
      )
    }

    return new PasswordVO( hash, true )
  }

  async hash( rounds: number = 10 ): Promise<PasswordVO> {
    if ( this._isHashed ) {
      throw new Error( 'Password is already hashed' )
    }

    const hashed = await hash( this._value, rounds )
    return new PasswordVO( hashed, true )
  }

  async compare( plainPassword: string ): Promise<boolean> {
    if ( !this._isHashed ) {
      throw new Error( 'Cannot compare with unhashed password' )
    }

    return compare( plainPassword, this._value )
  }

  static getStrength( password: string ): {
    score: number
    feedback: string[]
  } {
    const feedback: string[] = []
    let score = 0

    if ( password.length >= 8 ) score++
    if ( password.length >= 12 ) score++
    if ( /[a-z]/.test( password ) && /[A-Z]/.test( password ) ) score++
    if ( /\d/.test( password ) ) score++
    if ( /[!@#$%^&*(),.?":{}|<>]/.test( password ) ) score++

    if ( score < 3 ) feedback.push( 'Password is weak' )
    if ( password.length < 8 ) feedback.push( 'Use at least 8 characters' )
    if ( !/[A-Z]/.test( password ) ) feedback.push( 'Add uppercase letters' )
    if ( !/[a-z]/.test( password ) ) feedback.push( 'Add lowercase letters' )
    if ( !/\d/.test( password ) ) feedback.push( 'Add numbers' )

    return { score, feedback }
  }

  toString(): string {
    return this._isHashed ? '[HASHED]' : '[PLAIN]'
  }

  toJSON(): string {
    return '[REDACTED]'
  }
}