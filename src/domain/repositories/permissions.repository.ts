import type { CreatePermissionDto, PaginationDto } from '@/domain/dtos'
import type { PermissionEntity } from '../entities'
import type { PaginatedResponseEntity } from '../entities'

export abstract class PermissionsRepository {
  abstract createPermission ( createPermissionDto: CreatePermissionDto ): Promise<PermissionEntity>
  abstract listPermissions ( listPermissionsDto: PaginationDto ): Promise<PaginatedResponseEntity<PermissionEntity[]>>
}