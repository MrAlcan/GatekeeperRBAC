import type { AuthRepository } from '@/domain/repositories'
import type { GetMyPermissionsInput } from '@/domain/schemas'
import type { GetMyPermissionsResponseDTO } from '@/application/dtos'
import { EntityIdVO } from '@/domain/value-objects'
import { NotFoundError } from '@/domain/errors'

export class GetMyPermissionsUseCase {
  constructor(
    private readonly authRepository: AuthRepository
  ) {}

  async execute( userId: string ): Promise<GetMyPermissionsResponseDTO> {
    const userIdVO = EntityIdVO.create( userId )

    const permissions = await this.authRepository.getUserPermissions( userIdVO )

    return {
      success: true,
      data: {
        permissions
      }
    }
  }
}