import type { SignInDto } from '@/domain/dtos'
import type { UserEntity } from '../entities'
import type { GetMyPermissionsDto } from '@/domain/dtos'
import type { PermissionSlugVO } from '@/domain/value-objects'

export abstract class AuthRepository {
  abstract signIn ( signInDto: SignInDto ): Promise<UserEntity>
  abstract getMyPermissions ( getMyPermissionsDto: GetMyPermissionsDto ): Promise<PermissionSlugVO[]>
}