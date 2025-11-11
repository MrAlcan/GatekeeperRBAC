import { BaseError } from './base.error'

export class AuthorizationError extends BaseError {
  public readonly requiredPermissions?: string[]
  public readonly resource?: string

  constructor(
    message: string = 'Insufficient permissions',
    code: string = 'INSUFFICIENT_PERMISSIONS',
    requiredPermissions?: string[],
    resource?: string
  ) {
    super( message, 403, code, true )
    this.requiredPermissions = requiredPermissions
    this.resource = resource
  }

  static forbidden( resource?: string ): AuthorizationError {
    return new AuthorizationError(
      `Access to ${resource || 'this resource'} is forbidden`,
      'FORBIDDEN',
      undefined,
      resource
    )
  }

  static insufficientPermissions(
    requiredPermissions: string[],
    resource?: string
  ): AuthorizationError {
    return new AuthorizationError(
      `Insufficient permissions to access ${resource || 'this resource'}`,
      'INSUFFICIENT_PERMISSIONS',
      requiredPermissions,
      resource
    )
  }

  static roleRequired( requiredRole: string ): AuthorizationError {
    return new AuthorizationError(
      `Role '${requiredRole}' is required`,
      'ROLE_REQUIRED'
    )
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        statusCode: this.statusCode,
        timestamp: this.timestamp.toISOString(),
        ...( this.requiredPermissions && { requiredPermissions: this.requiredPermissions } ),
        ...( this.resource && { resource: this.resource } )
      }
    }
  }
}