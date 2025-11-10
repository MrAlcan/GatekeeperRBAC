import { PaginationEntity } from '@/domain/entities'
import { CustomError } from '@/domain/errors'

export interface PaginationObject {
  currentPage: number,
  pageSize: number,
  totalItems: number,
  totalPages: number,
}

export class PaginationMapper {

  static entityFromObject( object: { [ key: string ]: any } ): PaginationEntity {
    if ( !object )
      throw CustomError.badRequest( 'pagination.object.required' )

    const {
      currentPage,
      pageSize,
      totalItems,
      totalPages,
    } = object

    if ( !currentPage )
      throw CustomError.badRequest( 'pagination.currentPage.required' )

    if ( !pageSize )
      throw CustomError.badRequest( 'pagination.pageSize.required' )

    if ( !totalItems )
      throw CustomError.badRequest( 'pagination.totalItems.required' )

    if ( !totalPages )
      throw CustomError.badRequest( 'pagination.totalPages.required' )

    return new PaginationEntity(
      currentPage,
      pageSize,
      totalItems,
      totalPages,
    )
  }

  static objectFromEntity( entity: PaginationEntity ): PaginationObject {
    return {
      ...entity,
    }
  }

}