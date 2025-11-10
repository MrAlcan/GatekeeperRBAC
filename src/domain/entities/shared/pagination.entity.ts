export class PaginationEntity {
  constructor(
    public readonly currentPage: number,
    public readonly pageSize: number,
    public readonly totalItems: number,
    public readonly totalPages: number,
  ) {}
}