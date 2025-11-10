import { CustomError } from '@/domain/errors'
import { EntityIdVO } from '@/domain/value-objects'

export class AssignRoleToUserDto {
  private constructor (
    public readonly userId: EntityIdVO,
    public readonly roleId: EntityIdVO,
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
    const userIdVO = EntityIdVO.create( userId )
    const roleIdVO = EntityIdVO.create( roleId )
    return new AssignRoleToUserDto( userIdVO, roleIdVO )
  }
}