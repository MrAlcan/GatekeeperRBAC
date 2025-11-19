import swaggerJsdoc from 'swagger-jsdoc'
import { environments } from '@/infrastructure/config'

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RBAC System API',
      version: '1.0.0',
      description: `
# 🛡️ Sistema de Control de Acceso Basado en Roles (RBAC)

API REST completa para gestión de usuarios, roles y permisos con autenticación JWT.

## 🔐 Autenticación

Esta API utiliza **JWT (JSON Web Tokens)** con dos tipos de tokens:

- **Access Token**: Token de corta duración (15 min) enviado en cookies HttpOnly
- **Refresh Token**: Token de larga duración (7 días) para renovar el access token

### Cómo autenticarse:

1. **Login**: \`POST /api/v1/auth/sign-in\`
2. Las cookies se establecen automáticamente
3. Todos los endpoints protegidos usan estas cookies
4. Para renovar: \`POST /api/v1/auth/refresh\`

## 🎯 Sistema de Permisos

Los permisos siguen el formato: \`module:action\`

Ejemplos:
- \`users:create\` - Crear usuarios
- \`users:read\` - Leer usuarios
- \`roles:manage\` - Gestionar roles

## 📝 Formato de Respuestas

Todas las respuestas exitosas siguen este formato:

\`\`\`json
{
  "success": true,
  "data": { ... }
}
\`\`\`

Respuestas de error:

\`\`\`json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "statusCode": 400
  }
}
\`\`\`

## 🚀 Rate Limiting

- Endpoints públicos: 5 requests / 15 min
- Endpoints protegidos: 100 requests / 15 min
      `,
      contact: {
        name: 'API Support',
        email: 'support@example.com',
        url: 'https://github.com/your-repo'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: environments.API_URL,
        description: environments.NODE_ENV === 'production' 
          ? 'Production server' 
          : 'Development server'
      },
      {
        url: 'http://localhost:3000',
        description: 'Local development'
      }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
          description: 'JWT Access Token en cookie HttpOnly'
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Access Token en header (alternativa a cookies)'
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Token inválido, expirado o no proporcionado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'object',
                    properties: {
                      code: { type: 'string', example: 'TOKEN_INVALID' },
                      message: { type: 'string', example: 'Invalid or expired token' },
                      statusCode: { type: 'number', example: 401 }
                    }
                  }
                }
              }
            }
          }
        },
        ForbiddenError: {
          description: 'Permisos insuficientes',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'object',
                    properties: {
                      code: { type: 'string', example: 'INSUFFICIENT_PERMISSIONS' },
                      message: { type: 'string', example: 'You do not have permission to perform this action' },
                      statusCode: { type: 'number', example: 403 }
                    }
                  }
                }
              }
            }
          }
        },
        NotFoundError: {
          description: 'Recurso no encontrado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'object',
                    properties: {
                      code: { type: 'string', example: 'NOT_FOUND' },
                      message: { type: 'string', example: 'Resource not found' },
                      statusCode: { type: 'number', example: 404 }
                    }
                  }
                }
              }
            }
          }
        },
        ValidationError: {
          description: 'Error de validación',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'object',
                    properties: {
                      code: { type: 'string', example: 'VALIDATION_ERROR' },
                      message: { type: 'string', example: 'Validation failed' },
                      statusCode: { type: 'number', example: 400 },
                      details: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            field: { type: 'string', example: 'email' },
                            code: { type: 'string', example: 'invalid_string' },
                            message: { type: 'string', example: 'Invalid email format' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        RateLimitError: {
          description: 'Demasiadas peticiones',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'object',
                    properties: {
                      code: { type: 'string', example: 'RATE_LIMIT_EXCEEDED' },
                      message: { type: 'string', example: 'Too many requests, please try again later' },
                      statusCode: { type: 'number', example: 429 },
                      retryAfter: { type: 'number', example: 900 }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Auth',
        description: 'Autenticación y gestión de sesiones'
      },
      {
        name: 'Users',
        description: 'Gestión de usuarios'
      },
      {
        name: 'Roles',
        description: 'Gestión de roles'
      },
      {
        name: 'Permissions',
        description: 'Gestión de permisos'
      }
    ]
  },
  apis: [
    './src/presentation/swagger/paths/*.ts',
    './src/presentation/swagger/schemas/*.ts'
  ]
}

export const swaggerSpec = swaggerJsdoc(swaggerOptions)