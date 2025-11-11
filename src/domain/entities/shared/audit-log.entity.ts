import { EntityIdVO } from '@/domain/value-objects'

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOGIN_FAILED = 'LOGIN_FAILED',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  PASSWORD_RESET = 'PASSWORD_RESET',
  EMAIL_VERIFIED = 'EMAIL_VERIFIED',
  ROLE_ASSIGNED = 'ROLE_ASSIGNED',
  ROLE_REMOVED = 'ROLE_REMOVED',
  PERMISSION_ASSIGNED = 'PERMISSION_ASSIGNED',
  PERMISSION_REMOVED = 'PERMISSION_REMOVED'
}

export class AuditLogEntity {
  constructor(
    public readonly id: EntityIdVO,
    public readonly userId: EntityIdVO | null,
    public readonly action: AuditAction,
    public readonly entity: string,
    public readonly entityId: string | null,
    public readonly oldValues: Record<string, any> | null,
    public readonly newValues: Record<string, any> | null,
    public readonly ipAddress: string | null,
    public readonly userAgent: string | null,
    public readonly createdAt: Date
  ) {}

  isSuccessful(): boolean {
    return this.action !== AuditAction.LOGIN_FAILED
  }

  getSummary(): string {
    const user = this.userId ? `User ${ this.userId.value }` : 'Anonymous'
    const target = this.entityId ? ` (ID: ${ this.entityId })` : ''
    return `${ user } performed ${ this.action } on ${ this.entity }${ target }`
  }

  getChanges(): Record<string, { old: any; new: any }> | null {
    if ( !this.oldValues || !this.newValues ) return null

    const changes: Record<string, { old: any; new: any }> = {}

    for ( const key of Object.keys( this.newValues ) ) {
      if ( this.oldValues[ key ] !== this.newValues[ key ] ) {
        changes[ key ] = {
          old: this.oldValues[ key ],
          new: this.newValues[ key ]
        }
      }
    }

    return Object.keys( changes ).length > 0 ? changes : null
  }
}