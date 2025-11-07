import type { CreateUserDto, UpdateUserDto, ListUsersDto, AssignRoleToUserDto, RemoveRoleFromUserDto, GetUserByIdDto, DeleteUserDto } from '@/domain/dtos'
import type { UserEntity } from '../entities'

export abstract class UsersDatasource {
  abstract createUser ( createUserDto: CreateUserDto ): Promise<UserEntity>
  abstract updateUser ( updateUserDto: UpdateUserDto ): Promise<UserEntity>
  abstract deleteUser ( deleteUserDto: DeleteUserDto ): Promise<void>
  abstract getUserById ( getUserByIdDto: GetUserByIdDto ): Promise<UserEntity>
  abstract listUsers ( listUsersDto: ListUsersDto ): Promise<UserEntity[]>
  abstract assignRoleToUser ( assignRoleToUserDto: AssignRoleToUserDto ): Promise<void>
  abstract removeRoleFromUser ( removeRoleFromUserDto: RemoveRoleFromUserDto ): Promise<void>
}