import { ValidationError } from '../errors'

export class PermissionSlugVO {
  private readonly _value: string
  private readonly _module: string
  private readonly _action: string

  private constructor( slug: string ) {
    this._value = slug.toLowerCase().trim()
    const [ module, action ] = this._value.split( ':' )
    this._module = module
    this._action = action
  }

  get value(): string {
    return this._value
  }

  get module(): string {
    return this._module
  }

  get action(): string {
    return this._action
  }

  public static create( slug: string ): PermissionSlugVO {
    if ( !slug ) {
      throw ValidationError.singleField(
        'slug',
        'REQUIRED',
        'Permission slug is required'
      )
    }

    const trimmed = slug.trim()

    if ( !this.isValid( trimmed ) ) {
      throw ValidationError.singleField(
        'slug',
        'INVALID_FORMAT',
        'Permission slug must be in format "module:action" (lowercase, letters only)',
        slug
      )
    }

    return new PermissionSlugVO( trimmed )
  }

  public static fromParts( module: string, action: string ): PermissionSlugVO {
    return this.create( `${ module }:${ action }` )
  }

  private static isValid( slug: string ): boolean {
    const slugRegex = /^[a-z]+(?:-[a-z]+)*:[a-z]+(?:-[a-z]+)*$/
    return slugRegex.test( slug )
  }

  public belongsToModule( module: string ): boolean {
    return this._module === module.toLowerCase()
  }

  public hasAction( action: string ): boolean {
    return this._action === action.toLowerCase()
  }

  public equals( other: PermissionSlugVO ): boolean {
    return this._value === other._value
  }

  public toString(): string {
    return this._value
  }

  public toJSON(): string {
    return this._value
  }
}