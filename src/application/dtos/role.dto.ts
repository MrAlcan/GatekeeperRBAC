import { type RoleDTO } from '@/application/mappers'
import { type PaginatedDTO } from '@/application/mappers/shared'

export interface CreateRoleResponseDTO {
  success: boolean
  data: RoleDTO
}

export interface UpdateRoleResponseDTO {
  success: boolean
  data: RoleDTO
}

export interface DeleteRoleResponseDTO {
  success: boolean
  message: string
}

export interface GetRoleByIdResponseDTO {
  success: boolean
  data: RoleDTO
}

export interface ListRolesResponseDTO {
  success: boolean
  data: PaginatedDTO<RoleDTO>[ 'data' ]
  pagination: PaginatedDTO<RoleDTO>[ 'pagination' ]
}

export interface AssignPermissionToRoleResponseDTO {
  success: boolean
  message: string
}

export interface RemovePermissionFromRoleResponseDTO {
  success: boolean
  message: string
}