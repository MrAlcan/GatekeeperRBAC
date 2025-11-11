import { PermissionEntity } from '@/domain/entities/users/permission.entity';
import { EntityIdVO } from '@/domain/value-objects';

export class RoleEntity {
  constructor (
    public readonly id: EntityIdVO,
    public readonly name: string,
    public readonly permissions: PermissionEntity[],
    public readonly description?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  hasPermission( permissionSlug: string ): boolean {
    return this.permissions.some( permission => permission.slug.value === permissionSlug )
  }

  getPermissionCount(): number {
    return this.permissions.length
  }
}