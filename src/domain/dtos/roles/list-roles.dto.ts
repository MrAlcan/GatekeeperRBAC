import { CustomError } from '@/domain/errors'

export class ListRolesDto {
  private constructor (
    public readonly page?: number,
    public readonly limit?: number,
    public readonly search?: string,
    public readonly sort?: string,
    public readonly order?: string,
  ) {}

  static create ( object: Record<string, any> ): ListRolesDto {
    if ( !object ) {
      throw CustomError.badRequest( 'errors.listRoles.requestBody.required' )
    }
    const { page, limit, search, sort, order } = object
    return new ListRolesDto( page, limit, search, sort, order )
  }
}