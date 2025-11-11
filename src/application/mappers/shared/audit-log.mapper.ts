import { AuditLogEntity, AuditAction } from '@/domain/entities'
import { EntityIdVO } from '@/domain/value-objects'

export interface AuditLogRaw {
  id: string
  userId: string | null
  action: string
  entity: string
  entityId: string | null
  oldValues: any
  newValues: any
  ipAddress: string | null
  userAgent: string | null
  createdAt: Date
}

export interface AuditLogDTO {
  id: string
  userId?: string
  action: string
  entity: string
  entityId?: string
  summary: string
  changes?: Record<string, { old: any; new: any }>
  ipAddress?: string
  userAgent?: string
  createdAt: string
}

export class AuditLogMapper {
  static toDomain( raw: AuditLogRaw ): AuditLogEntity {
    return new AuditLogEntity(
      EntityIdVO.create( raw.id ),
      raw.userId ? EntityIdVO.create( raw.userId ) : null,
      raw.action as AuditAction,
      raw.entity,
      raw.entityId,
      raw.oldValues,
      raw.newValues,
      raw.ipAddress,
      raw.userAgent,
      raw.createdAt
    )
  }

  static toDTO( entity: AuditLogEntity ): AuditLogDTO {
    return {
      id: entity.id.value,
      userId: entity.userId?.value,
      action: entity.action,
      entity: entity.entity,
      entityId: entity.entityId || undefined,
      summary: entity.getSummary(),
      changes: entity.getChanges() || undefined,
      ipAddress: entity.ipAddress || undefined,
      userAgent: entity.userAgent || undefined,
      createdAt: entity.createdAt.toISOString()
    }
  }
}