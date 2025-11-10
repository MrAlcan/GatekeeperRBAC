import { CustomError } from '@/domain/errors'

export class PaginationDto {
  private constructor (
    public readonly page: number,
    public readonly pageSize: number,
    public readonly search?: string,
    public readonly sort?: string,
    public readonly order?: string,
  ) {}

  static create ( object: Record<string, any> ): PaginationDto {
    if ( !object ) {
      throw CustomError.badRequest( 'errors.pagination.requestBody.required' )
    }
    const {
      page = 1,
      pageSize = 10,
      search,
      sort,
      order,
    } = object

    if ( !page ) {
      throw CustomError.badRequest( 'errors.pagination.page.required' )
    }

    if ( !pageSize ) {
      throw CustomError.badRequest( 'errors.pagination.pageSize.required' )
    }

    return new PaginationDto( page, pageSize, search, sort, order )
  }
}