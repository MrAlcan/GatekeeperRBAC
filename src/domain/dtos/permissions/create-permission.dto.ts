import { CustomError } from '@/domain/errors'

export class CreatePermissionDto {
  private constructor (
    public readonly name: string,
    public readonly module: string,
    public readonly action: string,
    public readonly description?: string,
  ) {}

  static create ( object: Record<string, any> ): CreatePermissionDto {
    if ( !object ) {
      throw CustomError.badRequest( 'errors.createPermission.requestBody.required' )
    }
    const { name, description, module, action } = object
    if ( !name ) {
      throw CustomError.badRequest( 'errors.createPermission.name.required' )
    }
    if ( !module ) {
      throw CustomError.badRequest( 'errors.createPermission.module.required' )
    }
    if ( !action ) {
      throw CustomError.badRequest( 'errors.createPermission.action.required' )
    }
    const regex = /^[a-zA-Z ]+$/.test( name )
    if ( !regex ) {
      throw CustomError.badRequest( 'errors.createPermission.name.invalid' )
    }
    if ( description ) {
      const regex = /^[a-zA-Z ]+$/.test( description )
      if ( !regex ) {
        throw CustomError.badRequest( 'errors.createPermission.description.invalid' )
      }
    }
    const nameStr = name.trim()
    const descriptionStr = description?.trim()
    const moduleStr = module.trim()
    const actionStr = action.trim()
    return new CreatePermissionDto( nameStr, moduleStr, actionStr, descriptionStr )
  }
}