import type { ListUsersDto } from "@/domain/dtos";
import type { UserEntity } from "@/domain/entities";

export abstract class ListUsersUseCase {
  abstract execute ( listUsersDto: ListUsersDto ): Promise<UserEntity[]>
}