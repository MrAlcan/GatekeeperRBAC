import type { PermissionsRepository } from '@/domain/repositories'
import type { PermissionsDatasource } from '@/domain/datasources'
import type { PermissionEntity } from '@/domain/entities'
import type { CreatePermissionDto } from '@/domain/dtos'
import type { PaginationDto } from '@/domain/dtos'
import type { PaginatedResponseEntity } from '@/domain/entities'

export class PermissionsRepositoryImpl implements PermissionsRepository {
  constructor (
    private readonly datasource: PermissionsDatasource,
  ) {}

  createPermission ( dto: CreatePermissionDto ): Promise<PermissionEntity> {
    return this.datasource.createPermission( dto )
  }

  listPermissions ( listPermissionsDto: PaginationDto ): Promise<PaginatedResponseEntity<PermissionEntity[]>> {
    return this.datasource.listPermissions( listPermissionsDto )
  }

}