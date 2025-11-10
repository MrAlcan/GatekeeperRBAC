import { CustomError } from '@/domain/errors/custom.error'

export class EntityIdVO {
  public readonly value: string

  private constructor( id: string ) {
    this.value = id
  }

  public static create( id: string ): EntityIdVO {
    if ( !this.isValid( id ) ) {
      throw CustomError.badRequest( 'uuid.invalid', [{
        field: 'id',
        code: 'uuid.invalid',
        messageKey: 'El id debe ser un uuid valido',
      }] )
    }
    return new EntityIdVO( id )
  }

  private static isValid( id: string ): boolean {
    const idRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return idRegex.test( id )
  }
}