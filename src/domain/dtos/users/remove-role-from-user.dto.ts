import { CustomError } from '@/domain/errors'
import { EntityIdVO } from '@/domain/value-objects'

export class RemoveRoleFromUserDto {
  private constructor (
    public readonly userId: EntityIdVO,
    public readonly roleId: EntityIdVO,
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
    const userIdVO = EntityIdVO.create( userId )
    const roleIdVO = EntityIdVO.create( roleId )
    return new RemoveRoleFromUserDto( userIdVO, roleIdVO )
  }
}