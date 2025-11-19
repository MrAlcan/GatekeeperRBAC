import { AuthRepository } from '@/domain/repositories'
import { UserEntity } from '@/domain/entities'
import { EntityIdVO, EmailVO, PermissionSlugVO } from '@/domain/value-objects'
import { AuthenticationError, NotFoundError } from '@/domain/errors'
import { prisma } from '../data/prisma'
import { UserMapper } from '@/application/mappers'
import { compare } from 'bcryptjs'
import { randomBytes } from 'crypto'

export class AuthRepositoryImpl implements AuthRepository {

  async signIn(email: EmailVO, password: string): Promise<UserEntity> {

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

    if (!userRaw) {
      throw AuthenticationError.userNotFound()
    }

    const isValid = await compare(password, userRaw.password)
    if (!isValid) {
      throw AuthenticationError.invalidCredentials()
    }
    if (!userRaw.isActive) {
      throw AuthenticationError.accountInactive()
    }

    if (!userRaw.emailVerified) {
      throw AuthenticationError.emailNotVerified()
    }

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

  async findById(userId: EntityIdVO): Promise<UserEntity | null> {
    const userRaw = await prisma.user.findUnique({
      where: { id: userId.value },
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

  async getUserPermissions(userId: EntityIdVO): Promise<string[]> {

    const permissions = await prisma.$queryRaw<Array<{ permission_slug: string }>>`
      SELECT DISTINCT p.slug as permission_slug
      FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON ur.role_id = r.id
      JOIN role_permissions rp ON r.id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE u.id = ${userId.value}
      AND u.is_active = true
    `

    return permissions.map((p: any) => p.permission_slug)
  }

  async verifyEmail(userId: EntityIdVO, token: string): Promise<void> {
    const user = await prisma.user.findFirst({
      where: {
        id: userId.value,
        verificationToken: token
      }
    })

    if (!user) {
      throw AuthenticationError.tokenInvalid()
    }

    await prisma.user.update({
      where: { id: userId.value },
      data: {
        emailVerified: true,
        verificationToken: null
      }
    })
  }

  async generateEmailVerificationToken(userId: EntityIdVO): Promise<string> {
    const token = randomBytes(32).toString('hex')
    await prisma.user.update({
      where: { id: userId.value },
      data: {
        verificationToken: token
      }
    })

    return token
  }

  async generatePasswordResetToken(email: EmailVO): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { email: email.value }
    })

    if (!user) {
      throw NotFoundError.user()
    }

    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpiry: expiresAt
      }
    })

    return token
  }

  async validatePasswordResetToken(token: string): Promise<UserEntity> {
    const userRaw = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
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

    if (!userRaw) {
      throw AuthenticationError.tokenInvalid()
    }

    return UserMapper.toDomain(userRaw as any)
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.validatePasswordResetToken(token)

    await prisma.user.update({
      where: { id: user.id.value },
      data: {
        password: newPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })
  }

  async changePassword(
    userId: EntityIdVO,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId.value }
    })

    if (!user) {
      throw NotFoundError.user()
    }

    const isValid = await compare(currentPassword, user.password)
    if (!isValid) {
      throw AuthenticationError.invalidCredentials()
    }
    await prisma.user.update({
      where: { id: userId.value },
      data: {
        password: newPassword
      }
    })
  }
}