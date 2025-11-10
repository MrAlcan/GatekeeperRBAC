import type { SignInDto } from '@/domain/dtos'
import type { UserEntity } from '../entities'
import type { PermissionSlugVO } from '../value-objects'
import type { GetMyPermissionsDto } from '@/domain/dtos'

export abstract class AuthDatasource {
  abstract signIn ( signInDto: SignInDto ): Promise<UserEntity>
  abstract getMyPermissions ( getMyPermissionsDto: GetMyPermissionsDto ): Promise<PermissionSlugVO[]>
}