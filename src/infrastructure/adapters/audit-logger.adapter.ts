import { AuditLoggerPort, type AuditContext } from '@/application/ports'
import { AuditLogRepository } from '@/domain/repositories'
import { AuditAction } from '@/domain/entities'
import { EntityIdVO } from '@/domain/value-objects'

export class AuditLoggerAdapter implements AuditLoggerPort {
  constructor(
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async log(
    action: AuditAction,
    entity: string,
    entityId: string | null,
    oldValues: Record<string, any> | null,
    newValues: Record<string, any> | null,
    context?: AuditContext
  ): Promise<void> {
    await this.auditLogRepository.create(
      context?.userId ? EntityIdVO.create(context.userId) : null,
      action,
      entity,
      entityId,
      oldValues,
      newValues,
      context?.ipAddress,
      context?.userAgent
    )
  }

  async logCreate(
    entity: string,
    entityId: string,
    values: Record<string, any>,
    context?: AuditContext
  ): Promise<void> {
    await this.log(
      AuditAction.CREATE,
      entity,
      entityId,
      null,
      values,
      context
    )
  }

  async logUpdate(
    entity: string,
    entityId: string,
    oldValues: Record<string, any>,
    newValues: Record<string, any>,
    context?: AuditContext
  ): Promise<void> {
    await this.log(
      AuditAction.UPDATE,
      entity,
      entityId,
      oldValues,
      newValues,
      context
    )
  }

  async logDelete(
    entity: string,
    entityId: string,
    oldValues: Record<string, any>,
    context?: AuditContext
  ): Promise<void> {
    await this.log(
      AuditAction.DELETE,
      entity,
      entityId,
      oldValues,
      null,
      context
    )
  }

  async logLogin(userId: string, context?: AuditContext): Promise<void> {
    await this.log(
      AuditAction.LOGIN,
      'User',
      userId,
      null,
      null,
      context
    )
  }

  async logLoginFailed(email: string, context?: AuditContext): Promise<void> {
    await this.log(
      AuditAction.LOGIN_FAILED,
      'User',
      null,
      { email },
      null,
      context
    )
  }

  async logLogout(userId: string, context?: AuditContext): Promise<void> {
    await this.log(
      AuditAction.LOGOUT,
      'User',
      userId,
      null,
      null,
      context
    )
  }
}