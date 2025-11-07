import type { CreateRoleDto, UpdateRoleDto, ListRolesDto, AssignPermissionToRoleDto, RemovePermissionFromRoleDto } from '@/domain/dtos'
import type { RoleEntity } from '../entities'

export abstract class RolesRepository {
  abstract createRole ( createRoleDto: CreateRoleDto ): Promise<RoleEntity>
  abstract updateRole ( updateRoleDto: UpdateRoleDto ): Promise<RoleEntity>
  abstract listRoles ( listRolesDto: ListRolesDto ): Promise<RoleEntity[]>
  abstract assignPermissionToRole ( assignPermissionToRoleDto: AssignPermissionToRoleDto ): Promise<void>
  abstract removePermissionFromRole ( removePermissionFromRoleDto: RemovePermissionFromRoleDto ): Promise<void>
}