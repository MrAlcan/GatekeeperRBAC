/**
 * @swagger
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       properties:
 *         id:
 *           $ref: '#/components/schemas/UUID'
 *         slug:
 *           type: string
 *           example: users:create
 *           pattern: '^[a-z]+:[a-z]+$'
 *           description: Formato module:action
 *         name:
 *           type: string
 *           example: Create Users
 *         description:
 *           type: string
 *           example: Permission to create new users
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     CreatePermissionRequest:
 *       type: object
 *       required:
 *         - slug
 *         - name
 *       properties:
 *         slug:
 *           type: string
 *           pattern: '^[a-z]+:[a-z]+$'
 *           example: content:publish
 *           description: Formato module:action
 *         name:
 *           type: string
 *           example: Publish Content
 *         description:
 *           type: string
 *           example: Permission to publish content to production
 *     
 *     UpdatePermissionRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Publish Content to Production
 *         description:
 *           type: string
 *           example: Allows publishing content directly to production
 *     
 *     PermissionResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Permission'
 *     
 *     PermissionsListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Permission'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 */

export {}