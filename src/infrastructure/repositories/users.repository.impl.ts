import type { UsersRepository } from "@/domain/repositories";
import type { UsersDatasource } from "@/domain/datasources";
import type { UserEntity } from "@/domain/entities";
import type { CreateUserDto, UpdateUserDto, AssignRoleToUserDto, RemoveRoleFromUserDto, PaginationDto, GetUserByIdDto, DeleteUserDto } from "@/domain/dtos";
import type { PaginatedResponseEntity } from "@/domain/entities";

export class UsersRepositoryImpl implements UsersRepository {
  constructor (
    private readonly datasource: UsersDatasource,
  ) {}

  createUser ( dto: CreateUserDto ): Promise<UserEntity> {
    return this.datasource.createUser( dto )
  }

  updateUser ( updateUserDto: UpdateUserDto ): Promise<UserEntity> {
    return this.datasource.updateUser( updateUserDto )
  }

  listUsers ( listUsersDto: PaginationDto ): Promise<PaginatedResponseEntity<UserEntity[]>> {
    return this.datasource.listUsers( listUsersDto )
  }

  assignRoleToUser ( assignRoleToUserDto: AssignRoleToUserDto ): Promise<void> {
    return this.datasource.assignRoleToUser( assignRoleToUserDto )
  }

  removeRoleFromUser ( removeRoleFromUserDto: RemoveRoleFromUserDto ): Promise<void> {
    return this.datasource.removeRoleFromUser( removeRoleFromUserDto )
  }

  deleteUser ( deleteUserDto: DeleteUserDto ): Promise<void> {
    return this.datasource.deleteUser( deleteUserDto )
  }

  getUserById ( getUserByIdDto: GetUserByIdDto ): Promise<UserEntity> {
    return this.datasource.getUserById( getUserByIdDto )
  }

}