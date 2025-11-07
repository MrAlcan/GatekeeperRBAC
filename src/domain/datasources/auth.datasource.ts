import type { SignInDto } from '@/domain/dtos'
import type { UserEntity } from '../entities'

export abstract class AuthDatasource {
  abstract signIn ( signInDto: SignInDto ): Promise<UserEntity>
  abstract getMyPermissions (): Promise<string[]>
}