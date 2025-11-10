import { CustomError } from '@/domain/errors'
import { EntityIdVO } from '@/domain/value-objects'

export class UpdateRoleDto {
  private constructor (
    public readonly id: EntityIdVO,
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
    const idVO = EntityIdVO.create( id )
    const nameStr = name?.trim()
    const descriptionStr = description?.trim()
    return new UpdateRoleDto( idVO, nameStr, descriptionStr )
  }
}