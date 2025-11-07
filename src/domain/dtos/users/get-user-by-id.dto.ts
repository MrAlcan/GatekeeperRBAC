import { CustomError } from '@/domain/errors'

export class GetUserByIdDto {
  private constructor (
    public readonly id: string,
  ) {}

  static create ( object: Record<string, any> ): GetUserByIdDto {
    if ( !object ) {
      throw CustomError.badRequest( 'errors.getUserById.requestBody.required' )
    }
    const { id } = object
    if ( !id ) {
      throw CustomError.badRequest( 'errors.getUserById.id.required' )
    }
    const idStr = id.trim()
    return new GetUserByIdDto( idStr )
  }
}