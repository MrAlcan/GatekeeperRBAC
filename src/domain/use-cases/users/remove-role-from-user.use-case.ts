import type { RemoveRoleFromUserDto } from "@/domain/dtos";

export abstract class RemoveRoleFromUserUseCase {
  abstract execute ( removeRoleFromUserDto: RemoveRoleFromUserDto ): Promise<void>
}