import { RoleEntity } from '@/domain/entities/users/role.entity'
import { EntityIdVO, EmailVO } from '@/domain/value-objects'

export class UserEntity {
  constructor (
    public readonly id: EntityIdVO,
    public readonly name: string,
    public readonly lastName: string,
    public readonly email: EmailVO,
    public readonly roles: RoleEntity[],
    public readonly isActive: boolean,
    public readonly emailVerified: boolean = false,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  getFullName(): string {
    return `${ this.name } ${ this.lastName }`
  }

  getAllPermissions(): string[] {
    const permissions = new Set<string>()

    for ( const role of this.roles ) {
      for ( const permission of role.permissions ) {
        permissions.add( permission.slug.value )
      }
    }

    return Array.from( permissions )
  }

  hasPermission( permissionSlug: string ): boolean {
    return this.getAllPermissions().includes( permissionSlug )
  }

  hasAnyPermission( ...permissionSlugs: string[] ): boolean {
    const userPermissions = this.getAllPermissions()
    return permissionSlugs.some( slug => userPermissions.includes( slug ) )
  }

  hasAllPermissions( ...permissionSlugs: string[] ): boolean {
    const userPermissions = this.getAllPermissions()
    return permissionSlugs.every( slug => userPermissions.includes( slug ) )
  }

  hasRole( roleName: string ): boolean {
    return this.roles.some( role =>
      role.name.toLowerCase() === roleName.toLowerCase()
    )
  }

  canAccess(): boolean {
    return this.isActive && this.emailVerified
  }
}