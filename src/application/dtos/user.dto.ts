import { type UserDTO } from '@/application/mappers/users'
import { type PaginatedDTO } from '@/application/mappers/shared'

export interface CreateUserResponseDTO {
  success: boolean
  data: UserDTO
}

export interface UpdateUserResponseDTO {
  success: boolean
  data: UserDTO
}

export interface DeleteUserResponseDTO {
  success: boolean
  message: string
}

export interface GetUserByIdResponseDTO {
  success: boolean
  data: UserDTO
}

export interface ListUsersResponseDTO {
  success: boolean
  data: PaginatedDTO<UserDTO>['data']
  pagination: PaginatedDTO<UserDTO>['pagination']
}

export interface AssignRoleToUserResponseDTO {
  success: boolean
  message: string
}

export interface RemoveRoleFromUserResponseDTO {
  success: boolean
  message: string
}