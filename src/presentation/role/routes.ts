import { Router } from 'express'
import { RolesController } from './controllers'
import {
  validateBody,
  validateParams,
  validateQuery,
  authenticate,
  authorize,
  apiRateLimiter
} from '../../middleware'
import {
  CreateRoleSchema,
  UpdateRoleSchema,
  DeleteRoleSchema,
  GetRoleByIdSchema,
  AssignPermissionToRoleSchema,
  RemovePermissionFromRoleSchema,
  PaginationSchema
} from '@/domain/schemas'

export class RolesRoutes {
  static get routes(): Router {
    const router = Router()

    router.use(authenticate)
    router.use(apiRateLimiter)

    router.get(
      '/',
      authorize('roles:read'),
      validateQuery(PaginationSchema),
      RolesController.list
    )

    router.post(
      '/',
      authorize('roles:create'),
      validateBody(CreateRoleSchema),
      RolesController.create
    )

    router.get(
      '/:id',
      authorize('roles:read'),
      validateParams(GetRoleByIdSchema),
      RolesController.getById
    )

    router.put(
      '/:id',
      authorize('roles:update'),
      validateBody(UpdateRoleSchema),
      RolesController.update
    )

    router.delete(
      '/:id',
      authorize('roles:delete'),
      validateParams(DeleteRoleSchema),
      RolesController.delete
    )

    router.post(
      '/:id/permissions',
      authorize('roles:assign-permission'),
      validateBody(AssignPermissionToRoleSchema),
      RolesController.assignPermission
    )

    router.delete(
      '/:id/permissions/:permissionId',
      authorize('roles:remove-permission'),
      validateParams(RemovePermissionFromRoleSchema),
      RolesController.removePermission
    )

    return router
  }
}