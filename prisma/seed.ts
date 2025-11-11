// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // 1. Crear Permisos
  const permissions = await Promise.all([
    // Users
    prisma.permission.create({
      data: {
        slug: 'users:create',
        name: 'Create Users',
        module: 'users',
        action: 'create',
        description: 'Allows creating new users'
      }
    }),
    prisma.permission.create({
      data: {
        slug: 'users:read',
        name: 'Read Users',
        module: 'users',
        action: 'read',
        description: 'Allows viewing user information'
      }
    }),
    prisma.permission.create({
      data: {
        slug: 'users:update',
        name: 'Update Users',
        module: 'users',
        action: 'update',
        description: 'Allows updating user information'
      }
    }),
    prisma.permission.create({
      data: {
        slug: 'users:delete',
        name: 'Delete Users',
        module: 'users',
        action: 'delete',
        description: 'Allows deleting users'
      }
    }),
    // Roles
    prisma.permission.create({
      data: {
        slug: 'roles:manage',
        name: 'Manage Roles',
        module: 'roles',
        action: 'manage',
        description: 'Full access to role management'
      }
    }),
    // Permissions
    prisma.permission.create({
      data: {
        slug: 'permissions:manage',
        name: 'Manage Permissions',
        module: 'permissions',
        action: 'manage',
        description: 'Full access to permission management'
      }
    })
  ])

  console.log('✅ Permissions created:', permissions.length)

  // 2. Crear Roles
  const superAdminRole = await prisma.role.create({
    data: {
      name: 'Super Admin',
      description: 'Full system access',
      permissions: {
        create: permissions.map(p => ({
          permissionId: p.id
        }))
      }
    }
  })

  const adminRole = await prisma.role.create({
    data: {
      name: 'Admin',
      description: 'Administrative access',
      permissions: {
        create: permissions
          .filter(p => !p.slug.includes('permissions:'))
          .map(p => ({
            permissionId: p.id
          }))
      }
    }
  })

  const userRole = await prisma.role.create({
    data: {
      name: 'User',
      description: 'Basic user access',
      permissions: {
        create: permissions
          .filter(p => p.slug === 'users:read')
          .map(p => ({
            permissionId: p.id
          }))
      }
    }
  })

  console.log('✅ Roles created:', 3)

  // 3. Crear Usuario Super Admin
  const hashedPassword = await hash('Admin123!', 10)
  
  const superAdmin = await prisma.user.create({
    data: {
      name: 'Super',
      lastName: 'Admin',
      email: 'admin@system.com',
      password: hashedPassword,
      isActive: true,
      emailVerified: true,
      roles: {
        create: {
          roleId: superAdminRole.id
        }
      }
    },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true
                }
              }
            }
          }
        }
      }
    }
  })

  console.log('✅ Super Admin created:', superAdmin.email)
  console.log('   Password:', 'Admin123!')

  // 4. Crear Usuario de Prueba
  const testUser = await prisma.user.create({
    data: {
      name: 'Test',
      lastName: 'User',
      email: 'test@system.com',
      password: hashedPassword,
      isActive: true,
      emailVerified: true,
      roles: {
        create: {
          roleId: userRole.id
        }
      }
    }
  })

  console.log('✅ Test User created:', testUser.email)

  console.log('\n🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })