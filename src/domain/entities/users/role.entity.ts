import { PermissionEntity } from '@/domain/entities/users/permission.entity';

export class RoleEntity {
  constructor (
    public id: string,
    public name: string,
    public permissions: PermissionEntity[],
    public description?: string,
  ) {}
}