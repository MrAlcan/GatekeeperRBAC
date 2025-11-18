# 🛡️ RBAC System - Role-Based Access Control

Sistema completo de gestión de usuarios con control de acceso basado en roles (RBAC), construido con **Clean Architecture**, **TypeScript**, **Express** y **Prisma**.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.20-brightgreen)](https://www.prisma.io/)
[![Express](https://img.shields.io/badge/Express-4.19-lightgrey)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [API Documentation](#-api-documentation)
- [Base de Datos](#-base-de-datos)
- [Testing](#-testing)
- [Despliegue](#-despliegue)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## ✨ Características

### 🔐 Autenticación y Autorización
- ✅ JWT con Access Token y Refresh Token
- ✅ Cookies HttpOnly seguras
- ✅ Sistema de permisos granular
- ✅ Rate limiting por IP y usuario
- ✅ Bloqueo de cuenta tras intentos fallidos

### 👤 Gestión de Usuarios
- ✅ CRUD completo de usuarios
- ✅ Verificación de email
- ✅ Recuperación de contraseña
- ✅ Cambio de contraseña
- ✅ Asignación de roles

### 🎭 Sistema RBAC
- ✅ CRUD de roles
- ✅ CRUD de permisos
- ✅ Asignación de permisos a roles
- ✅ Validación de permisos en endpoints
- ✅ Permisos con formato `module:action`

### 📊 Auditoría
- ✅ Log de todas las acciones críticas
- ✅ Registro de IP y User Agent
- ✅ Tracking de cambios (old/new values)
- ✅ Historial de actividad por usuario

### 🛡️ Seguridad
- ✅ Bcrypt para passwords (10 rounds)
- ✅ Helmet para headers HTTP seguros
- ✅ CORS configurado
- ✅ Validación con Zod
- ✅ SQL Injection prevention (Prisma)
- ✅ XSS prevention

### 🏗️ Arquitectura
- ✅ Clean Architecture (Domain, Application, Infrastructure, Presentation)
- ✅ SOLID principles
- ✅ Dependency Injection
- ✅ Repository Pattern
- ✅ Use Case Pattern
- ✅ Value Objects
- ✅ Domain Events ready

---

## 🏛️ Arquitectura
```
src/
├── domain/              # Entidades, Value Objects, Interfaces
│   ├── entities/        # Modelos de dominio
│   ├── value-objects/   # Objetos de valor inmutables
│   ├── errors/          # Errores personalizados
│   ├── repositories/    # Interfaces de repositorios
│   └── schemas/         # Schemas de validación (Zod)
│
├── application/         # Casos de uso, Mappers, DTOs
│   ├── use-cases/       # Lógica de negocio
│   ├── mappers/         # Transformación de datos
│   ├── ports/           # Interfaces para servicios externos
│   └── dtos/            # DTOs de respuesta
│
├── infrastructure/      # Implementaciones concretas
│   ├── adapters/        # Implementación de ports
│   ├── repositories/    # Implementación de repositorios
│   ├── database/        # Prisma client
│   └── config/          # Configuración
│
└── presentation/        # API REST
    ├── controllers/     # Controllers de Express
    ├── routes/          # Definición de rutas
    ├── middlewares/     # Middlewares (auth, validation, etc.)
    └── server.ts        # Configuración del servidor
```

### Flujo de Datos
```
Request → Middleware → Controller → Use Case → Repository → Database
                          ↓
Response ← DTO ← Mapper ← Entity ← Mapper ← Database
```

---

## 📦 Requisitos Previos

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- **PostgreSQL** >= 14.0
- **Git**

---

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/rbac-system.git
cd rbac-system
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones (ver [Configuración](#-configuración))

### 4. Configurar base de datos
```bash
# Crear base de datos PostgreSQL
createdb rbac_db

# Generar cliente Prisma
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# Ejecutar seed (crea usuario admin y permisos básicos)
npm run db:seed
```

### 5. Iniciar servidor
```bash
# Desarrollo (con hot reload)
npm run dev

# Producción
npm run build
npm start
```

El servidor estará disponible en `http://localhost:3000`

---

## ⚙️ Configuración

### Variables de Entorno Obligatorias
```bash
# JWT Secrets (generar con el comando abajo)
JWT_SECRET=your-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/rbac_db
```

### Generar JWT Secrets Seguros
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Variables de Entorno Opcionales
```bash
# Server
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug

# Email (opcional en dev, obligatorio en prod)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourapp.com

# URLs
FRONTEND_URL=http://localhost:3001
API_URL=http://localhost:3000

# Security
BCRYPT_ROUNDS=10
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION=15

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🎯 Uso

### Credenciales por Defecto (Seed)

Después de ejecutar `npm run db:seed`, se crea:
```
Email:    admin@system.com
Password: Admin123!
Rol:      Super Admin (todos los permisos)
```

### Autenticación con Cookies

#### 1. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@system.com",
    "password": "Admin123!"
  }' \
  -c cookies.txt  # Guarda cookies
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "name": "Super",
      "lastName": "Admin",
      "email": "admin@system.com",
      "roles": [...]
    }
  }
}
```

**Cookies establecidas:**
- `accessToken` (15 min) - Para todas las requests
- `refreshToken` (7 días) - Solo para `/api/v1/auth/refresh`

#### 2. Hacer Requests Autenticadas
```bash
curl -X GET http://localhost:3000/api/v1/users \
  -b cookies.txt  # Usa cookies guardadas
```

#### 3. Renovar Access Token
```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -b cookies.txt \
  -c cookies.txt  # Actualiza cookies
```

#### 4. Logout
```bash
curl -X POST http://localhost:3000/api/v1/auth/sign-out \
  -b cookies.txt
```

### Crear Nuevos Usuarios

#### Opción 1: Via API (requiere permiso `users:create`)
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "roleIds": ["role-id-here"]
  }'
```

#### Opción 2: Via Seed Personalizado

Editar `prisma/seed.ts` y agregar:
```typescript
const newUser = await prisma.user.create({
  data: {
    name: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: await hash('SecurePass123!', 10),
    isActive: true,
    emailVerified: true,
    roles: {
      create: {
        roleId: adminRole.id
      }
    }
  }
})
```

Luego ejecutar:
```bash
npm run db:seed
```

---

## 📚 API Documentation

### Swagger UI

El sistema incluye documentación interactiva con Swagger.

**Acceder a:**
```
http://localhost:3000/api-docs
```

### Endpoints Principales

#### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/sign-in` | Iniciar sesión | No |
| POST | `/api/v1/auth/sign-out` | Cerrar sesión | Sí |
| POST | `/api/v1/auth/refresh` | Renovar access token | Refresh Token |
| GET | `/api/v1/auth/me` | Obtener usuario actual | Sí |
| GET | `/api/v1/auth/me/permissions` | Obtener permisos del usuario | Sí |
| POST | `/api/v1/auth/forgot-password` | Solicitar reset de password | No |
| POST | `/api/v1/auth/reset-password` | Resetear password | No |
| POST | `/api/v1/auth/change-password` | Cambiar password | Sí |

#### Usuarios

| Método | Endpoint | Descripción | Permiso |
|--------|----------|-------------|---------|
| GET | `/api/v1/users` | Listar usuarios | `users:read` |
| POST | `/api/v1/users` | Crear usuario | `users:create` |
| GET | `/api/v1/users/:id` | Obtener usuario | `users:read` |
| PUT | `/api/v1/users/:id` | Actualizar usuario | `users:update` |
| DELETE | `/api/v1/users/:id` | Eliminar usuario | `users:delete` |
| POST | `/api/v1/users/:id/roles` | Asignar rol | `users:assign-role` |
| DELETE | `/api/v1/users/:id/roles/:roleId` | Remover rol | `users:remove-role` |

#### Roles

| Método | Endpoint | Descripción | Permiso |
|--------|----------|-------------|---------|
| GET | `/api/v1/roles` | Listar roles | `roles:read` |
| POST | `/api/v1/roles` | Crear rol | `roles:create` |
| GET | `/api/v1/roles/:id` | Obtener rol | `roles:read` |
| PUT | `/api/v1/roles/:id` | Actualizar rol | `roles:update` |
| DELETE | `/api/v1/roles/:id` | Eliminar rol | `roles:delete` |
| POST | `/api/v1/roles/:id/permissions` | Asignar permiso | `roles:assign-permission` |
| DELETE | `/api/v1/roles/:id/permissions/:permissionId` | Remover permiso | `roles:remove-permission` |

#### Permisos

| Método | Endpoint | Descripción | Permiso |
|--------|----------|-------------|---------|
| GET | `/api/v1/permissions` | Listar permisos | `permissions:read` |
| POST | `/api/v1/permissions` | Crear permiso | `permissions:create` |
| GET | `/api/v1/permissions/:id` | Obtener permiso | `permissions:read` |
| PUT | `/api/v1/permissions/:id` | Actualizar permiso | `permissions:update` |
| DELETE | `/api/v1/permissions/:id` | Eliminar permiso | `permissions:delete` |

### Ejemplos de Requests

Ver [API_EXAMPLES.md](./docs/API_EXAMPLES.md) para ejemplos completos con curl, Postman y fetch.

---

## 🗄️ Base de Datos

### Schema

El sistema usa **PostgreSQL** con **Prisma ORM**.

#### Tablas Principales

- `users` - Usuarios del sistema
- `roles` - Roles (Admin, User, etc.)
- `permissions` - Permisos (`users:create`, etc.)
- `user_roles` - Relación usuarios-roles (many-to-many)
- `role_permissions` - Relación roles-permisos (many-to-many)
- `refresh_tokens` - Tokens de refresco
- `audit_logs` - Log de auditoría

### Comandos de Base de Datos
```bash
# Ver BD en navegador
npm run db:studio

# Crear nueva migración
npm run db:migrate

# Resetear BD (⚠️ borra todos los datos)
npm run db:reset

# Aplicar migraciones en producción
npm run db:migrate:prod

# Generar cliente Prisma
npm run db:generate
```

### Formato de Permisos

Los permisos siguen el formato: `module:action`

Ejemplos:
- `users:create`
- `users:read`
- `users:update`
- `users:delete`
- `roles:manage`
- `permissions:manage`

---

## 🧪 Testing
```bash
# Ejecutar todos los tests
npm test

# Tests en modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

---

## 🚢 Despliegue

### Docker
```bash
# Build
docker build -t rbac-system .

# Run
docker-compose up -d
```

### Variables de Entorno en Producción
```bash
NODE_ENV=production
LOG_LEVEL=warn
JWT_SECRET=<generar-secret-seguro>
JWT_REFRESH_SECRET=<generar-secret-seguro>
DATABASE_URL=<postgresql-url-produccion>
EMAIL_HOST=<smtp-host>
# ... resto de variables
```

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Tu Nombre** - [GitHub](https://github.com/tu-usuario) - [Email](mailto:tu-email@example.com)

---

## 🙏 Agradecimientos

- Clean Architecture por Robert C. Martin
- Domain-Driven Design por Eric Evans
- Prisma Team
- Express.js Team
- TypeScript Team

---

**⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub!**