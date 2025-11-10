import type { GetMyPermissionsDto } from '@/domain/dtos'
import type { AuthRepository } from '@/domain/repositories'
import type { PermissionSlugVO } from '@/domain/value-objects'
import { CustomError } from '@/domain/errors'

export interface GetMyPermissionsResponseDto {
  success: boolean
  data: string[]
}

export class GetMyPermissionsUseCase {
  constructor (
    private readonly  authRepository: AuthRepository
  ) {}
  async execute ( getMyPermissionsDto: GetMyPermissionsDto ): Promise<GetMyPermissionsResponseDto> {
    const permissions: PermissionSlugVO[] = await this.authRepository.getMyPermissions( getMyPermissionsDto )
    if ( permissions.length === 0 ) {
      return {
        success: true,
        data: []
      }
    }

    return {
      success: true,
      data: permissions.map( permission => permission.value )
    }
  }
}