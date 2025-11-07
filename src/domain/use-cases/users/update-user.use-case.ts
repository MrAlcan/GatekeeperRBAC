import type { UpdateUserDto } from '@/domain/dtos'
import type { UserEntity } from '@/domain/entities'

export abstract class UpdateUserUseCase {
  abstract execute ( updateUserDto: UpdateUserDto ): Promise<UserEntity>
}