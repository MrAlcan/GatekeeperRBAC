import { PaginationEntity } from './pagination.entity'

export class PaginatedResponseEntity<T> {
  constructor(
    public readonly pagination: PaginationEntity,
    public readonly data: T,
  ) {}
}