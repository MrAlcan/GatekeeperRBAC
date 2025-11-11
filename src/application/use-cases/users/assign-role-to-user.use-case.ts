import type { UsersRepository, RolesRepository } from '@/domain/repositories'
import type { AuditLoggerPort } from '@/application/ports'
import type { AssignRoleToUserInput } from '@/domain/schemas'
import type { AssignRoleToUserResponseDTO } from '@/application/dtos'
import { EntityIdVO } from '@/domain/value-objects'
import { NotFoundError } from '@/domain/errors'
import { AuditAction } from '@/domain/entities'

export class AssignRoleToUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rolesRepository: RolesRepository,
    private readonly auditLogger: AuditLoggerPort
  ) {}

  async execute(
    input: AssignRoleToUserInput,
    context?: { ipAddress?: string; userAgent?: string }
  ): Promise<AssignRoleToUserResponseDTO> {
    const userIdVO = EntityIdVO.create( input.userId )
    const roleIdVO = EntityIdVO.create( input.roleId )

    const user = await this.usersRepository.findById( userIdVO )
    if (!user) {
      throw NotFoundError.user( input.userId )
    }
    const role = await this.rolesRepository.findById( roleIdVO )
    if (!role) {
      throw NotFoundError.role( input.roleId )
    }

    await this.usersRepository.assignRole( userIdVO, roleIdVO )

    await this.auditLogger.log(
      AuditAction.ROLE_ASSIGNED,
      'User',
      input.userId,
      null,
      { roleId: input.roleId, roleName: role.name },
      context
    )

    return {
      success: true,
      message: `Role "${ role.name }" assigned successfully`
    }
  }
}