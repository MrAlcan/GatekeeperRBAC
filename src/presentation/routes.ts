import { Router } from 'express'
import { UsersRoutes } from './user'
import { RolesRoutes } from './role'
import { PermissionsRoutes } from './permission'
import { AuthRoutes } from './auth'

export class AppRoutes {
  static get routes(): Router {
    const router = Router()

    router.get('/health', (req, res) => {
      res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      })
    })

    router.use('/api/v1/auth', AuthRoutes.routes)
    router.use('/api/v1/users', UsersRoutes.routes)
    router.use('/api/v1/roles', RolesRoutes.routes)
    router.use('/api/v1/permissions', PermissionsRoutes.routes)

    return router
  }
}
