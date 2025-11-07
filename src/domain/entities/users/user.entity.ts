import { RoleEntity } from '@/domain/entities/users/role.entity';
import { EmailVO } from '@/domain/value-objects/email.value-object';

export class UserEntity {
  constructor (
    public id: string,
    public name: string,
    public lastName: string,
    public email: EmailVO,
    public password: string,
    public roles: RoleEntity[],
    public isActive: boolean,
  ) {}
}