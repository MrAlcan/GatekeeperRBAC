import type { Request, Response, NextFunction } from 'express'
import {
  CreateUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  GetUserByIdUseCase,
  ListUsersUseCase,
  AssignRoleToUserUseCase,
  RemoveRoleFromUserUseCase
} from '@/application/use-cases'
import {
  UsersRepositoryImpl,
  RolesRepositoryImpl,
  AuditLogRepositoryImpl
} from '@/infrastructure/repositories'
import {
  BcryptHasherAdapter,
  NodemailerSenderAdapter,
  AuditLoggerAdapter
} from '@/infrastructure/adapters'
import type { PaginationParams } from '@/domain/repositories'

export class UsersController {

  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const usersRepository = new UsersRepositoryImpl()
      const rolesRepository = new RolesRepositoryImpl()
      const passwordHasher = new BcryptHasherAdapter()
      const emailSender = new NodemailerSenderAdapter()
      const auditLogRepository = new AuditLogRepositoryImpl()
      const auditLogger = new AuditLoggerAdapter(auditLogRepository)

      const useCase = new CreateUserUseCase(
        usersRepository,
        rolesRepository,
        passwordHasher,
        emailSender,
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
      const usersRepository = new UsersRepositoryImpl()
      const useCase = new ListUsersUseCase(usersRepository)

      const paginationParams: PaginationParams = {
        page: Number(req.query.page) || 1,
        pageSize: Number(req.query.pageSize) || 10,
        search: req.query.search as string,
        sort: req.query.sort as string,
        order: req.query.order as 'asc' | 'desc'
      }

      const result = await useCase.execute(paginationParams)

      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  static getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const usersRepository = new UsersRepositoryImpl()
      const useCase = new GetUserByIdUseCase(usersRepository)

      const result = await useCase.execute({ id: req.params.id })

      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const usersRepository = new UsersRepositoryImpl()
      const auditLogRepository = new AuditLogRepositoryImpl()
      const auditLogger = new AuditLoggerAdapter(auditLogRepository)

      const useCase = new UpdateUserUseCase(
        usersRepository,
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
      const usersRepository = new UsersRepositoryImpl()
      const auditLogRepository = new AuditLogRepositoryImpl()
      const auditLogger = new AuditLoggerAdapter(auditLogRepository)

      const useCase = new DeleteUserUseCase(
        usersRepository,
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

  static assignRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const usersRepository = new UsersRepositoryImpl()
      const rolesRepository = new RolesRepositoryImpl()
      const auditLogRepository = new AuditLogRepositoryImpl()
      const auditLogger = new AuditLoggerAdapter(auditLogRepository)

      const useCase = new AssignRoleToUserUseCase(
        usersRepository,
        rolesRepository,
        auditLogger
      )

      const result = await useCase.execute(
        { userId: req.params.id, roleId: req.body.roleId },
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

  static removeRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const usersRepository = new UsersRepositoryImpl()
      const rolesRepository = new RolesRepositoryImpl()
      const auditLogRepository = new AuditLogRepositoryImpl()
      const auditLogger = new AuditLoggerAdapter(auditLogRepository)

      const useCase = new RemoveRoleFromUserUseCase(
        usersRepository,
        rolesRepository,
        auditLogger
      )

      const result = await useCase.execute(
        { userId: req.params.id, roleId: req.params.roleId },
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