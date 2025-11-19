/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           $ref: '#/components/schemas/UUID'
 *         name:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         isActive:
 *           type: boolean
 *           example: true
 *         emailVerified:
 *           type: boolean
 *           example: true
 *         roles:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Role'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *     
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - name
 *         - lastName
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           example: John
 *         lastName:
 *           type: string
 *           minLength: 2
 *           example: Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8
 *           example: SecurePass123!
 *           description: Debe contener mayúsculas, minúsculas y números
 *         roleIds:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UUID'
 *           description: IDs de roles a asignar
 *     
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           example: John
 *         lastName:
 *           type: string
 *           minLength: 2
 *           example: Doe
 *         isActive:
 *           type: boolean
 *           example: true
 *     
 *     AssignRoleRequest:
 *       type: object
 *       required:
 *         - roleId
 *       properties:
 *         roleId:
 *           $ref: '#/components/schemas/UUID'
 *     
 *     UserResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/User'
 *     
 *     UsersListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 */

export {}