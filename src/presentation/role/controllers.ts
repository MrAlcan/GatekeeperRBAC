import type { Request, Response, NextFunction } from 'express'
import {
  CreateRoleUseCase,
  UpdateRoleUseCase,
  DeleteRoleUseCase,
  GetRoleByIdUseCase,
  ListRolesUseCase,
  AssignPermissionToRoleUseCase,
  RemovePermissionFromRoleUseCase
} from '@/application/use-cases'
import {
  RolesRepositoryImpl,
  PermissionsRepositoryImpl,
  AuditLogRepositoryImpl
} from '@/infrastructure/repositories'
import { AuditLoggerAdapter } from '@/infrastructure/adapters'
import type { PaginationParams } from '@/domain/repositories'

export class RolesController {

  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rolesRepository = new RolesRepositoryImpl()
      const auditLogRepository = new AuditLogRepositoryImpl()
      const auditLogger = new AuditLoggerAdapter(auditLogRepository)

      const useCase = new CreateRoleUseCase(
        rolesRepository,
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
      const rolesRepository = new RolesRepositoryImpl()
      const useCase = new ListRolesUseCase(rolesRepository)

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
      const rolesRepository = new RolesRepositoryImpl()
      const useCase = new GetRoleByIdUseCase(rolesRepository)

      const result = await useCase.execute({ id: req.params.id })

      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rolesRepository = new RolesRepositoryImpl()
      const auditLogRepository = new AuditLogRepositoryImpl()
      const auditLogger = new AuditLoggerAdapter(auditLogRepository)

      const useCase = new UpdateRoleUseCase(
        rolesRepository,
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
      const rolesRepository = new RolesRepositoryImpl()
      const auditLogRepository = new AuditLogRepositoryImpl()
      const auditLogger = new AuditLoggerAdapter(auditLogRepository)

      const useCase = new DeleteRoleUseCase(
        rolesRepository,
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

  static assignPermission = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rolesRepository = new RolesRepositoryImpl()
      const permissionsRepository = new PermissionsRepositoryImpl()
      const auditLogRepository = new AuditLogRepositoryImpl()
      const auditLogger = new AuditLoggerAdapter(auditLogRepository)

      const useCase = new AssignPermissionToRoleUseCase(
        rolesRepository,
        permissionsRepository,
        auditLogger
      )

      const result = await useCase.execute(
        { roleId: req.params.id, permissionId: req.body.permissionId },
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

  static removePermission = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rolesRepository = new RolesRepositoryImpl()
      const permissionsRepository = new PermissionsRepositoryImpl()
      const auditLogRepository = new AuditLogRepositoryImpl()
      const auditLogger = new AuditLoggerAdapter(auditLogRepository)

      const useCase = new RemovePermissionFromRoleUseCase(
        rolesRepository,
        permissionsRepository,
        auditLogger
      )

      const result = await useCase.execute(
        { roleId: req.params.id, permissionId: req.params.permissionId },
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
}