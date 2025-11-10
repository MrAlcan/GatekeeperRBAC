import { CustomError } from '@/domain/errors'
import { EntityIdVO } from '@/domain/value-objects'

export class RemovePermissionFromRoleDto {
  private constructor (
    public readonly roleId: EntityIdVO,
    public readonly permissionId: EntityIdVO,
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
    const roleIdVO = EntityIdVO.create( roleId )
    const permissionIdVO = EntityIdVO.create( permissionId )
    return new RemovePermissionFromRoleDto( roleIdVO, permissionIdVO )
  }
}