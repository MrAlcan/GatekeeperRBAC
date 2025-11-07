import { CustomError } from '@/domain/errors/custom.error'

export class PermissionSlugVO {
  public readonly value: string

  private constructor( permissionSlug: string ) {
    this.value = permissionSlug.toLowerCase().trim()
  }

  public static create( permissionSlug: string ): PermissionSlugVO {
    if ( !this.isValid( permissionSlug ) ) {
      throw CustomError.badRequest( 'Invalid permission slug format', [{
        field: 'permissionSlug',
        code: 'invalid_permission_slug_format',
        messageKey: 'invalid_permission_slug_format',
      }] )
    }
    return new PermissionSlugVO( permissionSlug )
  }

  private static isValid( permissionSlug: string ): boolean {
    const permissionSlugRegex = /^[a-z]+(?:-[a-z]+)*:[a-z]+$/
    return permissionSlugRegex.test( permissionSlug )
  } // se puede extender para ser mas exactos
}