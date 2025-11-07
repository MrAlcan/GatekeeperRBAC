import type { AssignRoleToUserDto } from '@/domain/dtos'

export abstract class AssignRoleToUserUseCase {
  abstract execute ( assignRoleToUserDto: AssignRoleToUserDto ): Promise<void>
}