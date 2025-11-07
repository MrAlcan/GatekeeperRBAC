import type { CreateRoleDto } from '@/domain/dtos'
import type { RoleEntity } from '@/domain/entities'

export abstract class CreateRoleUseCase {
  abstract execute ( createRoleDto: CreateRoleDto ): Promise<RoleEntity>
}