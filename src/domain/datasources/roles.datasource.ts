import type { CreateRoleDto, UpdateRoleDto, AssignPermissionToRoleDto, RemovePermissionFromRoleDto, PaginationDto } from '@/domain/dtos'
import type { RoleEntity } from '../entities'
import type { PaginatedResponseEntity } from '../entities'

export abstract class RolesDatasource {
  abstract createRole ( createRoleDto: CreateRoleDto ): Promise<RoleEntity>
  abstract updateRole ( updateRoleDto: UpdateRoleDto ): Promise<RoleEntity>
  abstract listRoles ( listRolesDto: PaginationDto ): Promise<PaginatedResponseEntity<RoleEntity[]>>
  abstract assignPermissionToRole ( assignPermissionToRoleDto: AssignPermissionToRoleDto ): Promise<void>
  abstract removePermissionFromRole ( removePermissionFromRoleDto: RemovePermissionFromRoleDto ): Promise<void>
}