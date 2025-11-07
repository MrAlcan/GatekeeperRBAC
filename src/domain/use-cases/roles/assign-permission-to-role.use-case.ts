import type { AssignPermissionToRoleDto } from '@/domain/dtos'

export abstract class AssignPermissionToRoleUseCase {
  abstract execute ( assignPermissionToRoleDto: AssignPermissionToRoleDto ): Promise<void>
}