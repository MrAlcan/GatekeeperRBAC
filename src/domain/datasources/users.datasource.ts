import type { CreateUserDto, UpdateUserDto, AssignRoleToUserDto, RemoveRoleFromUserDto, GetUserByIdDto, DeleteUserDto, PaginationDto } from '@/domain/dtos'
import type { UserEntity } from '../entities'
import type { PaginatedResponseEntity } from '../entities'

export abstract class UsersDatasource {
  abstract createUser ( createUserDto: CreateUserDto ): Promise<UserEntity>
  abstract updateUser ( updateUserDto: UpdateUserDto ): Promise<UserEntity>
  abstract deleteUser ( deleteUserDto: DeleteUserDto ): Promise<void>
  abstract getUserById ( getUserByIdDto: GetUserByIdDto ): Promise<UserEntity>
  abstract listUsers ( listUsersDto: PaginationDto ): Promise<PaginatedResponseEntity<UserEntity[]>>
  abstract assignRoleToUser ( assignRoleToUserDto: AssignRoleToUserDto ): Promise<void>
  abstract removeRoleFromUser ( removeRoleFromUserDto: RemoveRoleFromUserDto ): Promise<void>
}