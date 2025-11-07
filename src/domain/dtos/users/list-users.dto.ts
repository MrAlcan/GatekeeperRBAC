import { CustomError } from '@/domain/errors'

export class ListUsersDto {
  private constructor (
    public readonly page?: number,
    public readonly limit?: number,
    public readonly search?: string,
    public readonly sort?: string,
    public readonly order?: string,
  ) {}

  static create ( object: Record<string, any> ): ListUsersDto {
    if ( !object ) {
      throw CustomError.badRequest( 'errors.listUsers.requestBody.required' )
    }
    const { page, limit, search, sort, order } = object
    return new ListUsersDto( page, limit, search, sort, order )
  }
}
