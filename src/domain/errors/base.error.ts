export abstract class BaseError extends Error {
  public readonly statusCode: number
  public readonly code: string
  public readonly timestamp: Date
  public readonly isOperational: boolean // true if error is expected, false if it's a bug

  constructor(
    message: string,
    statusCode: number,
    code: string,
    isOperational: boolean = true,
  ) {
    super( message )
    this.statusCode = statusCode
    this.code = code
    this.timestamp = new Date()
    this.isOperational = isOperational
    Error.captureStackTrace( this, this.constructor )
    Object.setPrototypeOf( this, new.target.prototype )
    this.name = this.constructor.name
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        statusCode: this.statusCode,
        timestamp: this.timestamp.toISOString()
      }
    }
  }

  toLogObject() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      stack: this.stack,
      isOperational: this.isOperational
    }
  }
}