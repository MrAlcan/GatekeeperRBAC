import { RolesRepository, type PaginationParams } from '@/domain/repositories'
import { RoleEntity, PaginatedResponseEntity } from '@/domain/entities'
import { EntityIdVO } from '@/domain/value-objects'
import { NotFoundError } from '@/domain/errors'
import { prisma } from '../data/prisma'
import { RoleMapper, PaginationMapper } from '@/application/mappers'

export class RolesRepositoryImpl implements RolesRepository {

  async create(name: string, description?: string): Promise<RoleEntity> {
    const roleRaw = await prisma.role.create({
      data: {
        name,
        description: description || null
      },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    })

    return RoleMapper.toDomain({
      ...roleRaw,
      permissions: roleRaw.permissions.map((rp: any) => rp.permission)
    } as any)
  }

  async update(
    id: EntityIdVO,
    data: {
      name?: string
      description?: string
    }
  ): Promise<RoleEntity> {
    const roleRaw = await prisma.role.update({
      where: { id: id.value },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description })
      },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    })

    return RoleMapper.toDomain({
      ...roleRaw,
      permissions: roleRaw.permissions.map((rp: any) => rp.permission)
    } as any)
  }

  async delete(id: EntityIdVO): Promise<void> {
    await prisma.role.delete({
      where: { id: id.value }
    })
  }

  async findById(id: EntityIdVO): Promise<RoleEntity | null> {
    const roleRaw = await prisma.role.findUnique({
      where: { id: id.value },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    })

    if (!roleRaw) return null

    return RoleMapper.toDomain({
      ...roleRaw,
      permissions: roleRaw.permissions.map((rp: any) => rp.permission)
    } as any)
  }

  async findByName(name: string): Promise<RoleEntity | null> {
    const roleRaw = await prisma.role.findUnique({
      where: { name },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    })

    if (!roleRaw) return null

    return RoleMapper.toDomain({
      ...roleRaw,
      permissions: roleRaw.permissions.map((rp: any) => rp.permission)
    } as any)
  }

  async findMany(params: PaginationParams): Promise<PaginatedResponseEntity<RoleEntity[]>> {
    const { page, pageSize, search, sort = 'createdAt', order = 'desc' } = params

    const skip = (page - 1) * pageSize

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } }
          ]
        }
      : {}

    const orderBy = { [sort]: order }

    const [rolesRaw, totalItems] = await Promise.all([
      prisma.role.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
        include: {
          permissions: {
            include: {
              permission: true
            }
          }
        }
      }),
      prisma.role.count({ where })
    ])

    const roles = rolesRaw.map((r: any) =>
      RoleMapper.toDomain({
        ...r,
        permissions: r.permissions.map((rp: any) => rp.permission)
      } as any)
    )

    const pagination = PaginationMapper.createEntity(page, pageSize, totalItems)

    return new PaginatedResponseEntity(pagination, roles)
  }

  async assignPermission(roleId: EntityIdVO, permissionId: EntityIdVO): Promise<void> {
    await prisma.rolePermission.create({
      data: {
        roleId: roleId.value,
        permissionId: permissionId.value
      }
    })
  }

  async removePermission(roleId: EntityIdVO, permissionId: EntityIdVO): Promise<void> {
    await prisma.rolePermission.delete({
      where: {
        roleId_permissionId: {
          roleId: roleId.value,
          permissionId: permissionId.value
        }
      }
    })
  }

  async hasUsers(roleId: EntityIdVO): Promise<boolean> {
    const count = await prisma.userRole.count({
      where: { roleId: roleId.value }
    })
    return count > 0
  }

  async nameExists(name: string): Promise<boolean> {
    const count = await prisma.role.count({
      where: { name }
    })
    return count > 0
  }
}