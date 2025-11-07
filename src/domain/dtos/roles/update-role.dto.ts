import { CustomError } from '@/domain/errors'

export class UpdateRoleDto {
  private constructor (
    public readonly id: string,
    public readonly name?: string,
    public readonly description?: string,
  ) {}

  static create ( object: Record<string, any> ): UpdateRoleDto {
    if ( !object ) {
      throw CustomError.badRequest( 'errors.updateRole.requestBody.required' )
    }
    const { id, name, description } = object
    if ( !id ) {
      throw CustomError.badRequest( 'errors.updateRole.id.required' )
    }
    if ( name ) {
      const regex = /^[a-zA-Z ]+$/.test( name )
      if ( !regex ) {
        throw CustomError.badRequest( 'errors.updateRole.name.invalid' )
      }
    }
    if ( description ) {
      const regex = /^[a-zA-Z ]+$/.test( description )
      if ( !regex ) {
        throw CustomError.badRequest( 'errors.updateRole.description.invalid' )
      }
    }
    const idStr = id.trim()
    const nameStr = name?.trim()
    const descriptionStr = description?.trim()
    return new UpdateRoleDto( idStr, nameStr, descriptionStr )
  }
}