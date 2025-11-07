import type { GetUserByIdDto } from '@/domain/dtos'
import type { UserEntity } from '@/domain/entities'

export abstract class GetUserByIdUseCase {
  abstract execute ( getUserByIdDto: GetUserByIdDto ): Promise<UserEntity>
}