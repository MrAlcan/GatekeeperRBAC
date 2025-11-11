import type { UsersRepository } from '@/domain/repositories'
import type { AuditLoggerPort } from '@/application/ports'
import type { UpdateUserInput } from '@/domain/schemas'
import type { UpdateUserResponseDTO } from '@/application/dtos'
import { EntityIdVO } from '@/domain/value-objects'
import { NotFoundError } from '@/domain/errors'
import { UserMapper } from '@/application/mappers'

export class UpdateUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly auditLogger: AuditLoggerPort
  ) {}

  async execute(
    input: UpdateUserInput,
    context?: { ipAddress?: string; userAgent?: string }
  ): Promise<UpdateUserResponseDTO> {
    const userIdVO = EntityIdVO.create( input.id )

    const existingUser = await this.usersRepository.findById( userIdVO )
    if ( !existingUser ) {
      throw NotFoundError.user( input.id )
    }

    const oldValues = {
      name: existingUser.name,
      lastName: existingUser.lastName,
      isActive: existingUser.isActive
    }

    const updatedUser = await this.usersRepository.update( userIdVO, {
      name: input.name,
      lastName: input.lastName,
      isActive: input.isActive
    } )

    const newValues = {
      name: updatedUser.name,
      lastName: updatedUser.lastName,
      isActive: updatedUser.isActive
    }

    await this.auditLogger.logUpdate(
      'User',
      input.id,
      oldValues,
      newValues,
      context
    )

    return {
      success: true,
      data: UserMapper.toDTO( updatedUser )
    }
  }
}