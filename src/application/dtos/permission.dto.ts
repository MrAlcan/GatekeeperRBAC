import { type PermissionDTO } from '@/application/mappers'
import { type PaginatedDTO } from '@/application/mappers/shared'

export interface CreatePermissionResponseDTO {
  success: boolean
  data: PermissionDTO
}

export interface UpdatePermissionResponseDTO {
  success: boolean
  data: PermissionDTO
}

export interface DeletePermissionResponseDTO {
  success: boolean
  message: string
}

export interface GetPermissionByIdResponseDTO {
  success: boolean
  data: PermissionDTO
}

export interface ListPermissionsResponseDTO {
  success: boolean
  data: PaginatedDTO<PermissionDTO>[ 'data' ]
  pagination: PaginatedDTO<PermissionDTO>[ 'pagination' ]
}