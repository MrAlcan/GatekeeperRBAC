import { CustomError } from '@/domain/errors'
import { EntityIdVO } from '@/domain/value-objects'

export class AssignPermissionToRoleDto {
  private constructor (
    public readonly roleId: EntityIdVO,
    public readonly permissionId: EntityIdVO,
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
    const roleIdVO = EntityIdVO.create( roleId )
    const permissionIdVO = EntityIdVO.create( permissionId )
    return new AssignPermissionToRoleDto( roleIdVO, permissionIdVO )
  }
}