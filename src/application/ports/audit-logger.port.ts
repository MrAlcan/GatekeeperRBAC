import { AuditAction } from '@/domain/entities'

export interface AuditContext {
  userId?: string
  ipAddress?: string
  userAgent?: string
  requestId?: string
}

export abstract class AuditLoggerPort {
  abstract log(
    action: AuditAction,
    entity: string,
    entityId: string | null,
    oldValues: Record<string, any> | null,
    newValues: Record<string, any> | null,
    context?: AuditContext
  ): Promise<void>

  abstract logCreate(
    entity: string,
    entityId: string,
    values: Record<string, any>,
    context?: AuditContext
  ): Promise<void>

  abstract logUpdate(
    entity: string,
    entityId: string,
    oldValues: Record<string, any>,
    newValues: Record<string, any>,
    context?: AuditContext
  ): Promise<void>

  abstract logDelete(
    entity: string,
    entityId: string,
    oldValues: Record<string, any>,
    context?: AuditContext
  ): Promise<void>

  abstract logLogin(
    userId: string,
    context?: AuditContext
  ): Promise<void>

  abstract logLoginFailed(
    email: string,
    context?: AuditContext
  ): Promise<void>

  abstract logLogout(
    userId: string,
    context?: AuditContext
  ): Promise<void>
}