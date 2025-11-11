import { BaseError } from "./base.error";

export interface ValidationErrorDetail {
  field: string        // Campo que falló (ej: "email")
  code: string         // Código del error (ej: "INVALID_FORMAT")
  message: string      // Mensaje legible (ej: "Email format is invalid")
  value?: any         // Valor que causó el error (opcional)
}

export class ValidationError extends BaseError {
  public readonly details: ValidationErrorDetail[]

  constructor( message: string, details: ValidationErrorDetail[] ) {
    super(
      message,
      400,
      'VALIDATION_ERROR',
      true
    )
    this.details = details
  }

  static fromFields( details: ValidationErrorDetail[] ): ValidationError {
    const fieldNames = details.map( d => d.field ).join( ', ' )
    return new ValidationError(
      `Validation failed for: ${ fieldNames }`,
      details
    )
  }

  static singleField(
    field: string,
    code: string,
    message: string,
    value?: any
  ): ValidationError {
    return new ValidationError( message, [
      { field, code, message, value }
    ] )
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        statusCode: this.statusCode,
        timestamp: this.timestamp.toISOString(),
        details: this.details
      }
    }
  }
}