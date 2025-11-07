import { CustomError } from '@/domain/errors'

export class ListPermissionsDto {
  private constructor (
    public readonly page?: number,
    public readonly limit?: number,
    public readonly search?: string,
    public readonly sort?: string,
    public readonly order?: string,
  ) {}

  static create ( object: Record<string, any> ): ListPermissionsDto {
    if ( !object ) {
      throw CustomError.badRequest( 'errors.listPermissions.requestBody.required' )
    }
    const { page, limit, search, sort, order } = object
    return new ListPermissionsDto( page, limit, search, sort, order )
  }
}
