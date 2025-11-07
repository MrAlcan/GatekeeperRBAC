import type { SignInDto } from '@/domain/dtos'
import type { UserEntity } from '@/domain/entities'

export abstract class SignInUseCase {
  abstract execute ( signInDto: SignInDto ): Promise<UserEntity>
}