import type { GetMyPermissionsDto } from '@/domain/dtos'

export abstract class GetMyPermissionsUseCase {
  abstract execute ( getMyPermissionsDto: GetMyPermissionsDto ): Promise<string[]>
}