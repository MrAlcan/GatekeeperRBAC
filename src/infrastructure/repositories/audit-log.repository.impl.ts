import { AuditLogRepository, type AuditLogFilters } from '@/domain/repositories'
import { AuditLogEntity, AuditAction } from '@/domain/entities'
import { EntityIdVO } from '@/domain/value-objects'
import { NotFoundError } from '@/domain/errors'
import { prisma } from '../data/prisma'
import { AuditLogMapper } from '@/application/mappers'
import { Prisma } from '@prisma/client'

export class AuditLogRepositoryImpl implements AuditLogRepository {
  async create(
    userId: EntityIdVO | null,
    action: AuditAction,
    entity: string,
    entityId: string | null,
    oldValues: Record<string, any> | null,
    newValues: Record<string, any> | null,
    ipAddress?: string,
    userAgent?: string
  ): Promise<AuditLogEntity> {
    const auditLogRaw = await prisma.auditLog.create({
      data: {
        userId: userId?.value || null,
        action,
        entity,
        entityId,
        oldValues: oldValues ? (oldValues) : null,
        newValues: newValues ? (newValues) : null,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null
      }
    })

    return AuditLogMapper.toDomain(auditLogRaw as any)
  }

  async findById(id: EntityIdVO): Promise<AuditLogEntity | null> {
    const auditLogRaw = await prisma.auditLog.findUnique({
      where: { id: id.value }
    })

    if (!auditLogRaw) return null

    return AuditLogMapper.toDomain(auditLogRaw as any)
  }

  async findMany(filters: AuditLogFilters): Promise<AuditLogEntity[]> {
    const {
      userId,
      action,
      entity,
      entityId,
      startDate,
      endDate,
      limit = 100,
      offset = 0
    } = filters

    const where: Prisma.AuditLogWhereInput = {}

    if (userId) where.userId = userId.value
    if (action) where.action = action
    if (entity) where.entity = entity
    if (entityId) where.entityId = entityId
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    const auditLogsRaw = await prisma.auditLog.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return auditLogsRaw.map((a: any) => AuditLogMapper.toDomain(a))
  }

  async count(filters: Omit<AuditLogFilters, 'limit' | 'offset'>): Promise<number> {
    const { userId, action, entity, entityId, startDate, endDate } = filters

    const where: Prisma.AuditLogWhereInput = {}

    if (userId) where.userId = userId.value
    if (action) where.action = action
    if (entity) where.entity = entity
    if (entityId) where.entityId = entityId
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    return prisma.auditLog.count({ where })
  }

  async getRecentActivity(
    userId: EntityIdVO,
    limit: number = 10
  ): Promise<AuditLogEntity[]> {
    const auditLogsRaw = await prisma.auditLog.findMany({
      where: {
        userId: userId.value
      },
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return auditLogsRaw.map((a: any) => AuditLogMapper.toDomain(a))
  }

  async deleteOlderThan(date: Date): Promise<number> {
    const result = await prisma.auditLog.deleteMany({
      where: {
        createdAt: {
          lt: date
        }
      }
    })

    return result.count
  }
}