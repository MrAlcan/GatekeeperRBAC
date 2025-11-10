import { CustomError } from '@/domain/errors'
import { EntityIdVO } from '@/domain/value-objects'

export class DeleteUserDto {
  private constructor (
    public readonly id: EntityIdVO,
  ) {}

  static create ( object: Record<string, any> ): DeleteUserDto {
    if ( !object ) {
      throw CustomError.badRequest( 'errors.deleteUser.requestBody.required' )
    }
    const { id } = object
    if ( !id ) {
      throw CustomError.badRequest( 'errors.deleteUser.id.required' )
    }
    const idVO = EntityIdVO.create( id )
    return new DeleteUserDto( idVO )
  }
}