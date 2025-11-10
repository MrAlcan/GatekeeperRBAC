import type { PaginationDto } from '@/domain/dtos'
import type { PaginationEntity, PermissionEntity } from '@/domain/entities'
import type { PermissionsRepository } from '@/domain/repositories'
import type { PaginatedResponseEntity } from '@/domain/entities'
import { CustomError } from '@/domain/errors'

export interface ListPermissionsResponseDto {
  success: boolean
  data: PermissionEntity[]
  pagination: PaginationEntity
}

export class ListPermissionsUseCase {
  constructor (
    private readonly permissionsRepository: PermissionsRepository
  ) {}
  async execute ( listPermissionsDto: PaginationDto ): Promise<ListPermissionsResponseDto> {
    const permissions: PaginatedResponseEntity<PermissionEntity[]> = await this.permissionsRepository.listPermissions( listPermissionsDto )
    if ( !permissions ) {
      throw CustomError.notFound( 'errors.listPermissions.permissions.notFound' )
    }
    return { success: true, data: permissions.data, pagination: permissions.pagination }
  }
}