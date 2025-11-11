import { AuditLogEntity, AuditAction } from '../entities'
import { EntityIdVO } from '../value-objects'

export interface AuditLogFilters {
  userId?: EntityIdVO
  action?: AuditAction
  entity?: string
  entityId?: string
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}

export abstract class AuditLogRepository {
  abstract create(
    userId: EntityIdVO | null,
    action: AuditAction,
    entity: string,
    entityId: string | null,
    oldValues: Record<string, any> | null,
    newValues: Record<string, any> | null,
    ipAddress?: string,
    userAgent?: string
  ): Promise<AuditLogEntity>
  abstract findById( id: EntityIdVO ): Promise<AuditLogEntity | null>
  abstract findMany( filters: AuditLogFilters ): Promise<AuditLogEntity[]>
  abstract count( filters: Omit<AuditLogFilters, 'limit' | 'offset'> ): Promise<number>
  abstract getRecentActivity( userId: EntityIdVO, limit?: number ): Promise<AuditLogEntity[]>
  abstract deleteOlderThan( date: Date ): Promise<number>
}