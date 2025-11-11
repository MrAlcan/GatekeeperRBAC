import { BaseError } from './base.error'

export class NotFoundError extends BaseError {
  public readonly resource: string
  public readonly resourceId?: string

  constructor( resource: string, resourceId?: string ) {
    const message = resourceId
      ? `${ resource } with id '${ resourceId }' not found`
      : `${ resource } not found`

    super( message, 404, 'NOT_FOUND', true )

    this.resource = resource
    this.resourceId = resourceId
  }

  static user( userId?: string ): NotFoundError {
    return new NotFoundError( 'User', userId )
  }

  static role( roleId?: string ): NotFoundError {
    return new NotFoundError( 'Role', roleId )
  }

  static permission( permissionId?: string ): NotFoundError {
    return new NotFoundError( 'Permission', permissionId )
  }

  static refreshToken( tokenId?: string ): NotFoundError {
    return new NotFoundError( 'Refresh token', tokenId )
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        statusCode: this.statusCode,
        timestamp: this.timestamp.toISOString(),
        resource: this.resource,
        ...( this.resourceId && { resourceId: this.resourceId } )
      }
    }
  }
}