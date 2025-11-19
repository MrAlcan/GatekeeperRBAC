/**
 * @swagger
 * components:
 *   schemas:
 *     Pagination:
 *       type: object
 *       properties:
 *         currentPage:
 *           type: integer
 *           example: 1
 *           description: Página actual
 *         pageSize:
 *           type: integer
 *           example: 10
 *           description: Tamaño de página
 *         totalItems:
 *           type: integer
 *           example: 100
 *           description: Total de items
 *         totalPages:
 *           type: integer
 *           example: 10
 *           description: Total de páginas
 *     
 *     PaginationQuery:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           description: Número de página
 *         pageSize:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *           description: Items por página
 *         search:
 *           type: string
 *           description: Término de búsqueda
 *         sort:
 *           type: string
 *           enum: [createdAt, updatedAt, name, email]
 *           default: createdAt
 *           description: Campo para ordenar
 *         order:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *           description: Orden de resultados
 *     
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Operation completed successfully
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *               example: ERROR_CODE
 *             message:
 *               type: string
 *               example: Error description
 *             statusCode:
 *               type: integer
 *               example: 400
 *             details:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   field:
 *                     type: string
 *                   code:
 *                     type: string
 *                   message:
 *                     type: string
 *     
 *     UUID:
 *       type: string
 *       format: uuid
 *       example: 550e8400-e29b-41d4-a716-446655440000
 *       pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
 */

export {}