import type { UsersRepository } from '@/domain/repositories'
import type { AuditLoggerPort } from '@/application/ports'
import type { DeleteUserInput } from '@/domain/schemas'
import type { DeleteUserResponseDTO } from '@/application/dtos'
import { EntityIdVO } from '@/domain/value-objects'
import { NotFoundError } from '@/domain/errors'

export class DeleteUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly auditLogger: AuditLoggerPort
  ) {}

  async execute(
    input: DeleteUserInput,
    context?: { ipAddress?: string; userAgent?: string }
  ): Promise<DeleteUserResponseDTO> {
    const userIdVO = EntityIdVO.create( input.id )

    const user = await this.usersRepository.findById( userIdVO )
    if ( !user ) {
      throw NotFoundError.user( input.id )
    }
    const oldValues = {
      name: user.name,
      lastName: user.lastName,
      email: user.email.value,
      isActive: user.isActive
    }

    await this.usersRepository.delete( userIdVO )

    await this.auditLogger.logDelete(
      'User',
      input.id,
      oldValues,
      context
    )

    return {
      success: true,
      message: 'User deleted successfully'
    }
  }
}