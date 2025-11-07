import type { CreateUserDto } from '@/domain/dtos'
import type { UserEntity } from '@/domain/entities'

export abstract class CreateUserUseCase {
  abstract execute ( createUserDto: CreateUserDto ): Promise<UserEntity>
}
