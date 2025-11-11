import { PermissionsRepository, type PaginationParams } from '@/domain/repositories'
import { PermissionEntity, PaginatedResponseEntity } from '@/domain/entities'
import { EntityIdVO, PermissionSlugVO } from '@/domain/value-objects'
import { NotFoundError } from '@/domain/errors'
import { prisma } from '../data/prisma'
import { PermissionMapper, PaginationMapper } from '@/application/mappers'

export class PermissionsRepositoryImpl implements PermissionsRepository {

  async create(
    slug: PermissionSlugVO,
    name: string,
    description?: string
  ): Promise<PermissionEntity> {
    const permissionRaw = await prisma.permission.create({
      data: {
        slug: slug.value,
        name,
        description: description || null
      }
    })

    return PermissionMapper.toDomain(permissionRaw)
  }

  async update(
    id: EntityIdVO,
    data: {
      name?: string
      description?: string
    }
  ): Promise<PermissionEntity> {
    const permissionRaw = await prisma.permission.update({
      where: { id: id.value },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description })
      }
    })

    return PermissionMapper.toDomain(permissionRaw)
  }

  async delete(id: EntityIdVO): Promise<void> {
    await prisma.permission.delete({
      where: { id: id.value }
    })
  }

  async findById(id: EntityIdVO): Promise<PermissionEntity | null> {
    const permissionRaw = await prisma.permission.findUnique({
      where: { id: id.value }
    })

    if (!permissionRaw) return null

    return PermissionMapper.toDomain(permissionRaw)
  }

  async findBySlug(slug: PermissionSlugVO): Promise<PermissionEntity | null> {
    const permissionRaw = await prisma.permission.findUnique({
      where: { slug: slug.value }
    })

    if (!permissionRaw) return null

    return PermissionMapper.toDomain(permissionRaw)
  }

  async findMany(params: PaginationParams): Promise<PaginatedResponseEntity<PermissionEntity[]>> {
    const { page, pageSize, search, sort = 'createdAt', order = 'desc' } = params

    const skip = (page - 1) * pageSize

    const where = search
      ? {
          OR: [
            { slug: { contains: search, mode: 'insensitive' as const } },
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } }
          ]
        }
      : {}

    const orderBy = { [sort]: order }

    const [permissionsRaw, totalItems] = await Promise.all([
      prisma.permission.findMany({
        where,
        skip,
        take: pageSize,
        orderBy
      }),
      prisma.permission.count({ where })
    ])

    const permissions = permissionsRaw.map((p: any) => PermissionMapper.toDomain(p))

    const pagination = PaginationMapper.createEntity(page, pageSize, totalItems)

    return new PaginatedResponseEntity(pagination, permissions)
  }

  async findByModule(module: string): Promise<PermissionEntity[]> {
    const permissionsRaw = await prisma.permission.findMany({
      where: {
        slug: {
          startsWith: `${module.toLowerCase()}:`
        }
      }
    })

    return permissionsRaw.map((p: any) => PermissionMapper.toDomain(p))
  }
  async isInUse(permissionId: EntityIdVO): Promise<boolean> {
    const count = await prisma.rolePermission.count({
      where: { permissionId: permissionId.value }
    })
    return count > 0
  }

  async slugExists(slug: PermissionSlugVO): Promise<boolean> {
    const count = await prisma.permission.count({
      where: { slug: slug.value }
    })
    return count > 0
  }
}