import { CustomError } from '@/domain/errors'

export class DeleteUserDto {
  private constructor (
    public readonly id: string,
  ) {}

  static create ( object: Record<string, any> ): DeleteUserDto {
    if ( !object ) {
      throw CustomError.badRequest( 'errors.deleteUser.requestBody.required' )
    }
    const { id } = object
    if ( !id ) {
      throw CustomError.badRequest( 'errors.deleteUser.id.required' )
    }
    const idStr = id.trim()
    return new DeleteUserDto( idStr )
  }
}