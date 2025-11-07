import type { UpdateRoleDto } from '@/domain/dtos'
import type { RoleEntity } from '@/domain/entities'

export abstract class UpdateRoleUseCase {
  abstract execute ( updateRoleDto: UpdateRoleDto ): Promise<RoleEntity>
}