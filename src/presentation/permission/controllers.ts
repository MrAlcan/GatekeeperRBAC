import type { Request, Response, NextFunction } from 'express'
import {
  CreatePermissionUseCase,
  UpdatePermissionUseCase,
  DeletePermissionUseCase,
  GetPermissionByIdUseCase,
  ListPermissionsUseCase
} from '@/application/use-cases'
import {
  PermissionsRepositoryImpl,
  AuditLogRepositoryImpl
} from '@/infrastructure/repositories'
import { AuditLoggerAdapter } from '@/infrastructure/adapters'
import type { PaginationParams } from '@/domain/repositories'

export class PermissionsController {

  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const permissionsRepository = new PermissionsRepositoryImpl()
      const auditLogRepository = new AuditLogRepositoryImpl()
      const auditLogger = new AuditLoggerAdapter(auditLogRepository)

      const useCase = new CreatePermissionUseCase(
        permissionsRepository,
        auditLogger
      )

      const result = await useCase.execute(req.body, {
        ipAddress: req.context.ipAddress,
        userAgent: req.context.userAgent
      })

      res.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }

  static list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const permissionsRepository = new PermissionsRepositoryImpl()
      const useCase = new ListPermissionsUseCase(permissionsRepository)

      const paginationParams: PaginationParams = {
        page: Number(req.query.page) || 1,
        pageSize: Number(req.query.pageSize) || 10,
        search: req.query.search as string,
        sort: req.query.sort as string,
        order: req.query.order as 'asc' | 'desc' | undefined
      }

      const result = await useCase.execute(paginationParams)

      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  static getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const permissionsRepository = new PermissionsRepositoryImpl()
      const useCase = new GetPermissionByIdUseCase(permissionsRepository)

      const result = await useCase.execute({ id: req.params.id })

      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const permissionsRepository = new PermissionsRepositoryImpl()
      const auditLogRepository = new AuditLogRepositoryImpl()
      const auditLogger = new AuditLoggerAdapter(auditLogRepository)

      const useCase = new UpdatePermissionUseCase(
        permissionsRepository,
        auditLogger
      )

      const result = await useCase.execute(
        { ...req.body, id: req.params.id },
        {
          ipAddress: req.context.ipAddress,
          userAgent: req.context.userAgent
        }
      )

      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const permissionsRepository = new PermissionsRepositoryImpl()
      const auditLogRepository = new AuditLogRepositoryImpl()
      const auditLogger = new AuditLoggerAdapter(auditLogRepository)

      const useCase = new DeletePermissionUseCase(
        permissionsRepository,
        auditLogger
      )

      const result = await useCase.execute({ id: req.params.id }, {
        ipAddress: req.context.ipAddress,
        userAgent: req.context.userAgent
      })

      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }
}