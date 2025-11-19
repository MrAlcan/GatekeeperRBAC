/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         id:
 *           $ref: '#/components/schemas/UUID'
 *         name:
 *           type: string
 *           example: Admin
 *         description:
 *           type: string
 *           example: Administrator role with full permissions
 *         permissions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Permission'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     CreateRoleRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           example: Editor
 *         description:
 *           type: string
 *           example: Can edit content but not manage users
 *     
 *     UpdateRoleRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           example: Senior Editor
 *         description:
 *           type: string
 *           example: Senior editor with additional permissions
 *     
 *     AssignPermissionRequest:
 *       type: object
 *       required:
 *         - permissionId
 *       properties:
 *         permissionId:
 *           $ref: '#/components/schemas/UUID'
 *     
 *     RoleResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Role'
 *     
 *     RolesListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Role'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 */

export {}