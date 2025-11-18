import { Router } from 'express'
import { PermissionsController } from './controllers'
import {
  validateBody,
  validateParams,
  validateQuery,
  authenticate,
  authorize,
  apiRateLimiter
} from '../../middleware'
import {
  CreatePermissionSchema,
  UpdatePermissionSchema,
  DeletePermissionSchema,
  GetPermissionByIdSchema,
  PaginationSchema
} from '@/domain/schemas'

export class PermissionsRoutes {
  static get routes(): Router {
    const router = Router()
    router.use(authenticate)
    router.use(apiRateLimiter)

    router.get(
      '/',
      authorize('permissions:read'),
      validateQuery(PaginationSchema),
      PermissionsController.list
    )

    router.post(
      '/',
      authorize('permissions:create'),
      validateBody(CreatePermissionSchema),
      PermissionsController.create
    )

    router.get(
      '/:id',
      authorize('permissions:read'),
      validateParams(GetPermissionByIdSchema),
      PermissionsController.getById
    )

    router.put(
      '/:id',
      authorize('permissions:update'),
      validateBody(UpdatePermissionSchema),
      PermissionsController.update
    )

    router.delete(
      '/:id',
      authorize('permissions:delete'),
      validateParams(DeletePermissionSchema),
      PermissionsController.delete
    )

    return router
  }
}