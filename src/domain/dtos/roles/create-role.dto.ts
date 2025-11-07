import { CustomError } from '@/domain/errors'

export class CreateRoleDto {
  private constructor (
    public readonly name: string,
    public readonly description?: string,
  ) {}

  static create ( object: Record<string, any> ): CreateRoleDto {
    if ( !object ) {
      throw CustomError.badRequest( 'errors.createRole.requestBody.required' )
    }
    const { name, description } = object
    if ( !name ) {
      throw CustomError.badRequest( 'errors.createRole.name.required' )
    }
    const regex = /^[a-zA-Z ]+$/.test( name )
    if ( !regex ) {
      throw CustomError.badRequest( 'errors.createRole.name.invalid' )
    }
    if ( description ) {
      const regex = /^[a-zA-Z ]+$/.test( description )
      if ( !regex ) {
        throw CustomError.badRequest( 'errors.createRole.description.invalid' )
      }
    }
    const nameStr = name.trim()
    const descriptionStr = description?.trim()
    return new CreateRoleDto( nameStr, descriptionStr )
  }
}