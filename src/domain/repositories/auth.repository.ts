import { UserEntity } from '../entities'
import { EntityIdVO, EmailVO } from '../value-objects'

export abstract class AuthRepository {

  abstract signIn( email: EmailVO, password: string ): Promise<UserEntity>
  abstract findByEmail( email: EmailVO ): Promise<UserEntity | null>
  abstract findById( userId: EntityIdVO ): Promise<UserEntity | null>
  abstract getUserPermissions( userId: EntityIdVO ): Promise<string[]>
  abstract verifyEmail( userId: EntityIdVO, token: string ): Promise<void>
  abstract generateEmailVerificationToken( userId: EntityIdVO ): Promise<string>
  abstract generatePasswordResetToken( email: EmailVO ): Promise<string>
  abstract validatePasswordResetToken( token: string ): Promise<UserEntity>
  abstract resetPassword( token: string, newPassword: string ): Promise<void>
  abstract changePassword( userId: EntityIdVO, currentPassword: string, newPassword: string ): Promise<void>
}