import type { RemovePermissionFromRoleDto } from '@/domain/dtos'

export abstract class RemovePermissionFromRoleUseCase {
  abstract execute ( removePermissionFromRoleDto: RemovePermissionFromRoleDto ): Promise<void>
}