import { CustomError } from '@/domain/errors'

export class UpdateUserDto {
  private constructor (
    public readonly id: string,
    public readonly name?: string,
    public readonly lastName?: string,
    public readonly isActive?: boolean,
  ) {}

  static create ( object: Record<string, any> ): UpdateUserDto {
    if ( !object ) {
      throw CustomError.badRequest( 'errors.updateUser.requestBody.required' )
    }
    const { id, name, lastName, isActive } = object
    if ( !id ) {
      throw CustomError.badRequest( 'errors.updateUser.id.required' )
    }

    if ( name ) {
      const regex = /^[a-zA-Z ]+$/.test( name )
      if ( !regex ) {
        throw CustomError.badRequest( 'errors.updateUser.name.invalid' )
      }
    }

    if ( lastName ) {
      const regex = /^[a-zA-Z ]+$/.test( lastName )
      if ( !regex ) {
        throw CustomError.badRequest( 'errors.updateUser.lastName.invalid' )
      }
    }

    if ( isActive && typeof isActive !== 'boolean' ) {
      throw CustomError.badRequest( 'errors.updateUser.isActive.invalid' )
    }

    const idStr = id.trim()
    const nameStr = name?.trim()
    const lastNameStr = lastName?.trim()
    return new UpdateUserDto( idStr, nameStr, lastNameStr, isActive )
  }
}