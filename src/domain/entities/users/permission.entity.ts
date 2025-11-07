import { PermissionSlugVO } from '@/domain/value-objects/permission-slug.value-object'

export class PermissionEntity {
  constructor (
    public id: string,
    public slug: PermissionSlugVO,
    public name: string,
    public description?: string,
  ) {}
}