/**
 * @swagger
 * components:
 *   schemas:
 *     SignInRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: admin@system.com
 *           description: Email del usuario
 *         password:
 *           type: string
 *           format: password
 *           example: Admin123!
 *           description: Contraseña del usuario
 *     
 *     SignInResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/User'
 *     
 *     ForgotPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *     
 *     ResetPasswordRequest:
 *       type: object
 *       required:
 *         - token
 *         - newPassword
 *       properties:
 *         token:
 *           type: string
 *           example: abc123token
 *         newPassword:
 *           type: string
 *           format: password
 *           minLength: 8
 *           example: NewSecurePass123!
 *           description: Debe contener mayúsculas, minúsculas y números
 *     
 *     ChangePasswordRequest:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *           format: password
 *           example: OldPass123!
 *         newPassword:
 *           type: string
 *           format: password
 *           minLength: 8
 *           example: NewPass123!
 *     
 *     VerifyEmailRequest:
 *       type: object
 *       required:
 *         - userId
 *         - token
 *       properties:
 *         userId:
 *           $ref: '#/components/schemas/UUID'
 *         token:
 *           type: string
 *           example: verification-token-here
 *     
 *     PermissionsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             type: string
 *           example: ['users:read', 'users:create', 'roles:manage']
 */

export {}