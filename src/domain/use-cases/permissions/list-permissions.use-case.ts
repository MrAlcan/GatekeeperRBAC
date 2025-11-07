import type { ListPermissionsDto } from '@/domain/dtos'
import type { PermissionEntity } from '@/domain/entities'

export abstract class ListPermissionsUseCase {
  abstract execute ( listPermissionsDto: ListPermissionsDto ): Promise<PermissionEntity[]>
}