import type { UsersRepository, RolesRepository } from '@/domain/repositories'
import type { PasswordHasherPort, EmailSenderPort, AuditLoggerPort } from '@/application/ports'
import type { CreateUserInput } from '@/domain/schemas'
import type { CreateUserResponseDTO } from '@/application/dtos'
import { EmailVO, PasswordVO, EntityIdVO } from '@/domain/value-objects'
import { DomainError } from '@/domain/errors'
import { UserMapper } from '@/application/mappers'
import { AuditAction } from '@/domain/entities'

export class CreateUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rolesRepository: RolesRepository,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly emailSender: EmailSenderPort,
    private readonly auditLogger: AuditLoggerPort
  ) {}

  async execute(
    input: CreateUserInput,
    context?: { ipAddress?: string; userAgent?: string }
  ): Promise<CreateUserResponseDTO> {
    const emailVO = EmailVO.create( input.email )
    const passwordVO = PasswordVO.createFromPlainText( input.password )

    const emailExists = await this.usersRepository.emailExists( emailVO )
    if ( emailExists ) {
      throw DomainError.duplicateEmail( input.email )
    }
    if ( input.roleIds && input.roleIds.length > 0 ) {
      for ( const roleId of input.roleIds ) {
        const roleIdVO = EntityIdVO.create( roleId )
        const role = await this.rolesRepository.findById( roleIdVO )
        if ( !role ) {
          throw DomainError.invalidOperation(
            'create user',
            `Role with id ${ roleId } not found`
          )
        }
      }
    }

    const hashedPassword = await passwordVO.hash()

    const user = await this.usersRepository.create(
      input.name,
      input.lastName,
      emailVO,
      hashedPassword.value
    )

    if ( input.roleIds && input.roleIds.length > 0 ) {
      for ( const roleId of input.roleIds ) {
        await this.usersRepository.assignRole(
          user.id,
          EntityIdVO.create( roleId )
        )
      }
    }

    const completeUser = await this.usersRepository.findById( user.id )
    if ( !completeUser ) {
      throw DomainError.invalidOperation( 'create user', 'Failed to retrieve created user' )
    }
    // TODO: Implementar generación de token
    // await this.emailSender.sendVerificationEmail(...)

    await this.auditLogger.logCreate(
      'User',
      user.id.value,
      {
        name: input.name,
        lastName: input.lastName,
        email: input.email
      },
      context
    )

    return {
      success: true,
      data: UserMapper.toDTO( completeUser )
    }
  }
}