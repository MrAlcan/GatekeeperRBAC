import { UsersRepository, type PaginationParams } from '@/domain/repositories'
import { UserEntity, PaginatedResponseEntity } from '@/domain/entities'
import { EntityIdVO, EmailVO } from '@/domain/value-objects'
import { NotFoundError } from '@/domain/errors'
import { prisma } from '../data/prisma'
import { UserMapper, PaginationMapper } from '@/application/mappers'

export class UsersRepositoryImpl implements UsersRepository {

  async create(
    name: string,
    lastName: string,
    email: EmailVO,
    hashedPassword: string
  ): Promise<UserEntity> {
    const userRaw = await prisma.user.create({
      data: {
        name,
        lastName,
        email: email.value,
        password: hashedPassword,
        isActive: true,
        emailVerified: false
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

    return UserMapper.toDomain(userRaw as any)
  }

  async update(
    id: EntityIdVO,
    data: {
      name?: string
      lastName?: string
      isActive?: boolean
    }
  ): Promise<UserEntity> {
    const userRaw = await prisma.user.update({
      where: { id: id.value },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.lastName && { lastName: data.lastName }),
        ...(data.isActive !== undefined && { isActive: data.isActive })
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

    return UserMapper.toDomain(userRaw as any)
  }

  async delete(id: EntityIdVO): Promise<void> {
    await prisma.user.update({
      where: { id: id.value },
      data: {
        isActive: false
      }
    })
  }

  async findById(id: EntityIdVO): Promise<UserEntity | null> {
    const userRaw = await prisma.user.findUnique({
      where: { id: id.value },
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

    if (!userRaw) return null

    return UserMapper.toDomain(userRaw as any)
  }

  async findByEmail(email: EmailVO): Promise<UserEntity | null> {
    const userRaw = await prisma.user.findUnique({
      where: { email: email.value },
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

    if (!userRaw) return null

    return UserMapper.toDomain(userRaw as any)
  }

  async findMany(params: PaginationParams): Promise<PaginatedResponseEntity<UserEntity[]>> {
    const { page, pageSize, search, sort = 'createdAt', order = 'desc' } = params

    const skip = (page - 1) * pageSize
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } }
          ]
        }
      : {}

    const orderBy = { [sort]: order }

    const [usersRaw, totalItems] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
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
      }),
      prisma.user.count({ where })
    ])

    const users = usersRaw.map((u: any) => UserMapper.toDomain(u))

    const pagination = PaginationMapper.createEntity(page, pageSize, totalItems)

    return new PaginatedResponseEntity(pagination, users)
  }

  async assignRole(userId: EntityIdVO, roleId: EntityIdVO): Promise<void> {
    await prisma.userRole.create({
      data: {
        userId: userId.value,
        roleId: roleId.value
      }
    })
  }

  async removeRole(userId: EntityIdVO, roleId: EntityIdVO): Promise<void> {
    await prisma.userRole.delete({
      where: {
        userId_roleId: {
          userId: userId.value,
          roleId: roleId.value
        }
      }
    })
  }

  async emailExists(email: EmailVO): Promise<boolean> {
    const count = await prisma.user.count({
      where: { email: email.value }
    })
    return count > 0
  }
}