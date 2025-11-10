import { EntityIdVO } from '@/domain/value-objects'
import { PermissionSlugVO } from '@/domain/value-objects/permission-slug.value-object'

export class PermissionEntity {
  constructor (
    public id: EntityIdVO,
    public slug: PermissionSlugVO,
    public name: string,
    public description?: string,
  ) {}
}