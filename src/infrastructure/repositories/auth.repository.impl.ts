import type { AuthRepository } from '@/domain/repositories'
import type { AuthDatasource } from '@/domain/datasources'
import type { SignInDto } from '@/domain/dtos'
import type { UserEntity } from '@/domain/entities'
import type { PermissionSlugVO } from '@/domain/value-objects'
import type { GetMyPermissionsDto } from '@/domain/dtos'

export class AuthRepositoryImpl implements AuthRepository {
  constructor (
    private readonly datasource: AuthDatasource,
  ) {}

  signIn ( dto: SignInDto ): Promise<UserEntity> {
    return this.datasource.signIn( dto )
  }

  getMyPermissions ( getMyPermissionsDto: GetMyPermissionsDto ): Promise<PermissionSlugVO[]> {
    return this.datasource.getMyPermissions( getMyPermissionsDto )
  }

}