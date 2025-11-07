import type { DeleteUserDto } from '@/domain/dtos'

export abstract class DeleteUserUseCase {
  abstract execute ( deleteUserDto: DeleteUserDto ): Promise<void>
}