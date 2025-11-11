import { BaseError } from './base.error'

export class AuthenticationError extends BaseError {
  constructor(
    message: string = 'Authentication failed',
    code: string = 'AUTHENTICATION_FAILED'
  ) {
    super( message, 401, code, true )
  }

  static invalidCredentials(): AuthenticationError {
    return new AuthenticationError(
      'Invalid email or password',
      'INVALID_CREDENTIALS'
    )
  }

  static tokenExpired(): AuthenticationError {
    return new AuthenticationError(
      'Token has expired',
      'TOKEN_EXPIRED'
    )
  }

  static tokenInvalid(): AuthenticationError {
    return new AuthenticationError(
      'Token is invalid',
      'TOKEN_INVALID'
    )
  }

  static tokenMissing(): AuthenticationError {
    return new AuthenticationError(
      'Authentication token is required',
      'TOKEN_MISSING'
    )
  }

  static userNotFound(): AuthenticationError {
    return new AuthenticationError(
      'User not found',
      'USER_NOT_FOUND'
    )
  }

  static accountInactive(): AuthenticationError {
    return new AuthenticationError(
      'Account is inactive',
      'ACCOUNT_INACTIVE'
    )
  }

  static emailNotVerified(): AuthenticationError {
    return new AuthenticationError(
      'Email is not verified',
      'EMAIL_NOT_VERIFIED'
    )
  }
}