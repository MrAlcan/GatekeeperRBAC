import { PermissionEntity } from '@/domain/entities/users/permission.entity';
import { EntityIdVO } from '@/domain/value-objects';

export class RoleEntity {
  constructor (
    public id: EntityIdVO,
    public name: string,
    public permissions: PermissionEntity[],
    public description?: string,
  ) {}
}