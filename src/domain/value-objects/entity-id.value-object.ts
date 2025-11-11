import { ValidationError } from '../errors'
import { randomUUID } from 'crypto'

export class EntityIdVO {
  private readonly _value: string

  private constructor( id: string ) {
    this._value = id
  }

  get value(): string {
    return this._value
  }

  public static create( id: string ): EntityIdVO {
    if ( !id ) {
      throw ValidationError.singleField(
        'id',
        'REQUIRED',
        'ID is required'
      )
    }

    const trimmed = id.trim()

    if ( !this.isValid( trimmed ) ) {
      throw ValidationError.singleField(
        'id',
        'INVALID_FORMAT',
        'ID must be a valid UUID',
        id
      )
    }

    return new EntityIdVO( trimmed )
  }

  public static generate(): EntityIdVO {
    return new EntityIdVO( randomUUID() )
  }

  private static isValid( id: string ): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test( id )
  }

  public equals( other: EntityIdVO ): boolean {
    return this._value === other._value
  }

  public toString(): string {
    return this._value
  }

  public toJSON(): string {
    return this._value
  }
}