import { CustomError } from '@/domain/errors'

export class AssignRoleToUserDto {
  private constructor (
    public readonly userId: string,
    public readonly roleId: string,
  ) {}

  static create ( object: Record<string, any> ): AssignRoleToUserDto {
    if ( !object ) {
      throw CustomError.badRequest( 'errors.assignRoleToUser.requestBody.required' )
    }
    const { userId, roleId } = object
    if ( !userId ) {
      throw CustomError.badRequest( 'errors.assignRoleToUser.userId.required' )
    }
    if ( !roleId ) {
      throw CustomError.badRequest( 'errors.assignRoleToUser.roleId.required' )
    }
    const userIdStr = userId.trim()
    const roleIdStr = roleId.trim()
    return new AssignRoleToUserDto( userIdStr, roleIdStr )
  }
}