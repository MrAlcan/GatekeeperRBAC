import type { CreatePermissionDto, PaginationDto } from '@/domain/dtos'
import type { PaginatedResponseEntity, PermissionEntity } from '../entities'

export abstract class PermissionsDatasource {
  abstract createPermission ( createPermissionDto: CreatePermissionDto ): Promise<PermissionEntity>
  abstract listPermissions ( listPermissionsDto: PaginationDto ): Promise<PaginatedResponseEntity<PermissionEntity[]>>
}