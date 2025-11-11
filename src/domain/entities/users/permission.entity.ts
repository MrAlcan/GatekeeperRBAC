import { EntityIdVO } from '@/domain/value-objects'
import { PermissionSlugVO } from '@/domain/value-objects/permission-slug.value-object'

export class PermissionEntity {
  constructor (
    public readonly id: EntityIdVO,
    public readonly slug: PermissionSlugVO,
    public readonly name: string,
    public readonly description?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  getModule(): string {
    return this.slug.module
  }

  getAction(): string {
    return this.slug.action
  }
}