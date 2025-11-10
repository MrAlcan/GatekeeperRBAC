import { CustomError } from '@/domain/errors'
import { EntityIdVO } from '@/domain/value-objects'

export class GetUserByIdDto {
  private constructor (
    public readonly id: EntityIdVO,
  ) {}

  static create ( object: Record<string, any> ): GetUserByIdDto {
    if ( !object ) {
      throw CustomError.badRequest( 'errors.getUserById.requestBody.required' )
    }
    const { id } = object
    if ( !id ) {
      throw CustomError.badRequest( 'errors.getUserById.id.required' )
    }
    const idVO = EntityIdVO.create( id )
    return new GetUserByIdDto( idVO )
  }
}