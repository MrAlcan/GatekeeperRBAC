import { CustomError } from '@/domain/errors'

export class GetMyPermissionsDto {
  private constructor (
    public readonly userId: string,
  ) {}

  static create ( object: Record<string, any> ): GetMyPermissionsDto {
    if ( !object ) {
      throw CustomError.badRequest( 'errors.getMyPermissions.requestBody.required' )
    }
    const { userId } = object
    if ( !userId ) {
      throw CustomError.badRequest( 'errors.getMyPermissions.userId.required' )
    }
    const userIdStr = userId.trim()
    return new GetMyPermissionsDto( userIdStr )
  }
}