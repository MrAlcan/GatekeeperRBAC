import { BaseError } from './base.error'

export class DomainError extends BaseError {
  constructor(
    message: string,
    code: string = 'DOMAIN_ERROR'
  ) {
    super( message, 400, code, true )
  }

  static roleHasUsers( roleName: string ): DomainError {
    return new DomainError(
      `Cannot delete role '${ roleName }' because it has users assigned`,
      'ROLE_HAS_USERS'
    )
  }

  static permissionInUse( permissionSlug: string ): DomainError {
    return new DomainError(
      `Cannot delete permission '${ permissionSlug }' because it is assigned to roles`,
      'PERMISSION_IN_USE'
    )
  }

  static duplicateEmail( email: string ): DomainError {
    return new DomainError(
      `Email '${ email }' is already in use`,
      'DUPLICATE_EMAIL'
    )
  }

  static duplicateRole( roleName: string ): DomainError {
    return new DomainError(
      `Role '${ roleName }' already exists`,
      'DUPLICATE_ROLE'
    )
  }

  static duplicatePermission( slug: string ): DomainError {
    return new DomainError(
      `Permission '${ slug }' already exists`,
      'DUPLICATE_PERMISSION'
    )
  }

  static weakPassword(): DomainError {
    return new DomainError(
      'Password does not meet security requirements',
      'WEAK_PASSWORD'
    )
  }

  static invalidOperation( operation: string, reason: string ): DomainError {
    return new DomainError(
      `Cannot ${ operation }: ${ reason }`,
      'INVALID_OPERATION'
    )
  }
}