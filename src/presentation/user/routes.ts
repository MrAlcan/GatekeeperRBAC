import { Router } from 'express'
import { UsersController } from './controllers'
import {
  validateBody,
  validateParams,
  validateQuery,
  authenticate,
  authorize,
  apiRateLimiter
} from '../../middleware'
import {
  CreateUserSchema,
  UpdateUserSchema,
  DeleteUserSchema,
  GetUserByIdSchema,
  AssignRoleToUserSchema,
  RemoveRoleFromUserSchema,
  PaginationSchema
} from '@/domain/schemas'

export class UsersRoutes {
  static get routes(): Router {
    const router = Router()

    router.use(authenticate)
    router.use(apiRateLimiter)

    router.get(
      '/',
      authorize('users:read'),
      validateQuery(PaginationSchema),
      UsersController.list
    )

    router.post(
      '/',
      authorize('users:create'),
      validateBody(CreateUserSchema),
      UsersController.create
    )

    router.get(
      '/:id',
      authorize('users:read'),
      validateParams(GetUserByIdSchema),
      UsersController.getById
    )

    router.put(
      '/:id',
      authorize('users:update'),
      validateBody(UpdateUserSchema),
      UsersController.update
    )

    router.delete(
      '/:id',
      authorize('users:delete'),
      validateParams(DeleteUserSchema),
      UsersController.delete
    )

    router.post(
      '/:id/roles',
      authorize('users:assign-role'),
      validateBody(AssignRoleToUserSchema),
      UsersController.assignRole
    )

    router.delete(
      '/:id/roles/:roleId',
      authorize('users:remove-role'),
      validateParams(RemoveRoleFromUserSchema),
      UsersController.removeRole
    )

    return router
  }
}