import { CustomError } from '@/domain/errors'

export class AssignPermissionToRoleDto {
  private constructor (
    public readonly roleId: string,
    public readonly permissionId: string,
  ) {}

  static create ( object: Record<string, any> ): AssignPermissionToRoleDto {
    if ( !object ) {
      throw CustomError.badRequest( 'errors.assignPermissionToRole.requestBody.required' )
    }
    const { roleId, permissionId } = object
    if ( !roleId ) {
      throw CustomError.badRequest( 'errors.assignPermissionToRole.roleId.required' )
    }
    if ( !permissionId ) {
      throw CustomError.badRequest( 'errors.assignPermissionToRole.permissionId.required' )
    }
    const roleIdStr = roleId.trim()
    const permissionIdStr = permissionId.trim()
    return new AssignPermissionToRoleDto( roleIdStr, permissionIdStr )
  }
}