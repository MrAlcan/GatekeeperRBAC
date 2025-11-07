export interface ValidationErrorDetail {
  field: string
  code: string
  messageKey: string
}

export class CustomError extends Error {

  constructor (
    public readonly statusCode: number,
    public readonly message: string,
    public readonly details?: ValidationErrorDetail[],
  ) {
    super( message )
  }

  static badRequest ( message: string, details?: ValidationErrorDetail[] ) {
    return new CustomError( 400, message, details )
  }

  static unauthorized ( message: string = 'errors.auth.unauthorized' ) {
    return new CustomError( 401, message )
  }

  static forbidden ( message: string = 'errors.auth.forbidden' ) {
    return new CustomError( 403, message )
  }

  static notFound ( message: string = 'errors.resource.notFound' ) {
    return new CustomError( 404, message )
  }

  static internalServer ( message: string = 'errors.server.internal', details?: ValidationErrorDetail[] ) {
    return new CustomError( 500, message, details )
  }

  static notImplemented ( message: string = 'errors.server.notImplemented' ) {
    return new CustomError( 501, message )
  }
}
