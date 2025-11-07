import { CustomError } from '@/domain/errors'

export class RemovePermissionFromRoleDto {
  private constructor (
    public readonly roleId: string,
    public readonly permissionId: string,
  ) {}

  static create ( object: Record<string, any> ): RemovePermissionFromRoleDto {
    if ( !object ) {
      throw CustomError.badRequest( 'errors.removePermissionFromRole.requestBody.required' )
    }
    const { roleId, permissionId } = object
    if ( !roleId ) {
      throw CustomError.badRequest( 'errors.removePermissionFromRole.roleId.required' )
    }
    if ( !permissionId ) {
      throw CustomError.badRequest( 'errors.removePermissionFromRole.permissionId.required' )
    }
    const roleIdStr = roleId.trim()
    const permissionIdStr = permissionId.trim()
    return new RemovePermissionFromRoleDto( roleIdStr, permissionIdStr )
  }
}