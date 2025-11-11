import { PaginationEntity, PaginatedResponseEntity } from '@/domain/entities'

export interface PaginationDTO {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface PaginatedDTO<T> {
  data: T[]
  pagination: PaginationDTO
}

export class PaginationMapper {
  static createEntity(
    currentPage: number,
    pageSize: number,
    totalItems: number
  ): PaginationEntity {
    const totalPages = Math.ceil( totalItems / pageSize )

    return new PaginationEntity(
      currentPage,
      pageSize,
      totalItems,
      totalPages
    )
  }

  static toDTO( entity: PaginationEntity ): PaginationDTO {
    return {
      currentPage: entity.currentPage,
      pageSize: entity.pageSize,
      totalItems: entity.totalItems,
      totalPages: entity.totalPages,
      hasNextPage: entity.currentPage < entity.totalPages,
      hasPreviousPage: entity.currentPage > 1
    }
  }

  static toPaginatedDTO<TEntity, TDTO>(
    entity: PaginatedResponseEntity<TEntity[]>,
    mapperFn: ( item: TEntity ) => TDTO
  ): PaginatedDTO<TDTO> {
    return {
      data: entity.data.map( mapperFn ),
      pagination: this.toDTO( entity.pagination )
    }
  }
}