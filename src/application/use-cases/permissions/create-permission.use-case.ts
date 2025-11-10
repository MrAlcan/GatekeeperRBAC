import type { CreatePermissionDto } from '@/domain/dtos'
import type { PermissionEntity } from '@/domain/entities'
import type { PermissionsRepository } from '@/domain/repositories'
import { CustomError } from '@/domain/errors'

export interface CreatePermissionResponseDto {
  success: boolean
  data: PermissionEntity
}

export class CreatePermissionUseCase {
  constructor (
    private readonly permissionsRepository: PermissionsRepository
  ) {}
  async execute ( createPermissionDto: CreatePermissionDto ): Promise<CreatePermissionResponseDto> {
    const permission = await this.permissionsRepository.createPermission( createPermissionDto )
    if ( !permission ) {
      throw CustomError.notFound( 'errors.createPermission.permission.notFound' )
    }
    return { success: true, data: permission }
  }
}