import { CustomError } from '@/domain/errors'

export class RemoveRoleFromUserDto {
  private constructor (
    public readonly userId: string,
    public readonly roleId: string,
  ) {}

  static create ( object: Record<string, any> ): RemoveRoleFromUserDto {
    if ( !object ) {
      throw CustomError.badRequest( 'errors.removeRoleFromUser.requestBody.required' )
    }
    const { userId, roleId } = object
    if ( !userId ) {
      throw CustomError.badRequest( 'errors.removeRoleFromUser.userId.required' )
    }
    if ( !roleId ) {
      throw CustomError.badRequest( 'errors.removeRoleFromUser.roleId.required' )
    }
    const userIdStr = userId.trim()
    const roleIdStr = roleId.trim()
    return new RemoveRoleFromUserDto( userIdStr, roleIdStr )
  }
}