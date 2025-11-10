import type { RolesRepository } from "@/domain/repositories";
import type { RolesDatasource } from "@/domain/datasources";
import type { RoleEntity } from "@/domain/entities";
import type { CreateRoleDto, UpdateRoleDto, AssignPermissionToRoleDto, RemovePermissionFromRoleDto, PaginationDto } from "@/domain/dtos";
import type { PaginatedResponseEntity } from "@/domain/entities";

export class RolesRepositoryImpl implements RolesRepository {
  constructor (
    private readonly datasource: RolesDatasource,
  ) {}

  createRole ( dto: CreateRoleDto ): Promise<RoleEntity> {
    return this.datasource.createRole( dto )
  }

  updateRole ( updateRoleDto: UpdateRoleDto ): Promise<RoleEntity> {
    return this.datasource.updateRole( updateRoleDto )
  }

  listRoles ( listRolesDto: PaginationDto ): Promise<PaginatedResponseEntity<RoleEntity[]>> {
    return this.datasource.listRoles( listRolesDto )
  }

  assignPermissionToRole ( assignPermissionToRoleDto: AssignPermissionToRoleDto ): Promise<void> {
    return this.datasource.assignPermissionToRole( assignPermissionToRoleDto )
  }

  removePermissionFromRole ( removePermissionFromRoleDto: RemovePermissionFromRoleDto ): Promise<void> {
    return this.datasource.removePermissionFromRole( removePermissionFromRoleDto )
  }

}
