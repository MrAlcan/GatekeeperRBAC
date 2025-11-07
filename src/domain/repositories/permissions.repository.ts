import type { CreatePermissionDto, ListPermissionsDto } from '@/domain/dtos'
import type { PermissionEntity } from '../entities'

export abstract class PermissionsRepository {
  abstract createPermission ( createPermissionDto: CreatePermissionDto ): Promise<PermissionEntity>
  abstract listPermissions ( listPermissionsDto: ListPermissionsDto ): Promise<PermissionEntity[]>
}