import { RoleEntity } from '@/domain/entities/users/role.entity'
import { EmailVO } from '@/domain/value-objects/email.value-object'
import { EntityIdVO } from '@/domain/value-objects'

export class UserEntity {
  constructor (
    public id: EntityIdVO,
    public name: string,
    public lastName: string,
    public email: EmailVO,
    public roles: RoleEntity[],
    public isActive: boolean,
  ) {}
}