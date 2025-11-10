import { PaginatedResponseEntity, PaginationEntity } from '@/domain/entities'
import { CustomError } from '@/domain/errors'

interface PaginatedObject<T> {
  data: T
  [ key: string ]: any
}

export class PaginatedResponseMapper {
  static entityFromObject <T> ( object: PaginatedObject<T> ): PaginatedResponseEntity<T> {
    const {
      pagination,
      data,
    } = object

    if ( !pagination ) throw CustomError.internalServer( 'pagination.required' )
    if ( !( pagination instanceof PaginationEntity ) ) throw CustomError.internalServer( 'pagination.type' )
    if ( !data ) throw CustomError.internalServer( 'data.required' )
    if ( !Array.isArray( data ) ) throw CustomError.internalServer( 'data.type' )

    return new PaginatedResponseEntity(
      pagination,
      data as unknown as T,
    )
  }

  static objectFromEntity <T> ( paginatedResponseEntity: PaginatedResponseEntity<T> ): { [ key: string ]: any } {
    return {
      pagination: paginatedResponseEntity.pagination,
      data: paginatedResponseEntity.data,
    }
  }
}
