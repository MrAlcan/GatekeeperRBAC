import { CustomError } from '@/domain/errors'
import { EntityIdVO } from '@/domain/value-objects'

export class GetMyPermissionsDto {
  private constructor (
    public readonly userId: EntityIdVO,
  ) {}

  static create ( object: Record<string, any> ): GetMyPermissionsDto {
    if ( !object ) {
      throw CustomError.badRequest( 'errors.getMyPermissions.requestBody.required' )
    }
    const { userId } = object
    if ( !userId )
      throw CustomError.badRequest( 'errors.getMyPermissions.userId.required' )

    if ( typeof userId !== 'string' )
      throw CustomError.badRequest( 'errors.getMyPermissions.userId.string' )

    const userIdStr = userId.trim()
    const userIdVO = EntityIdVO.create( userIdStr )

    return new GetMyPermissionsDto( userIdVO )
  }
}