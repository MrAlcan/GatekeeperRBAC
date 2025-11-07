import type { CreatePermissionDto } from '@/domain/dtos'
import type { PermissionEntity } from '@/domain/entities'

export abstract class CreatePermissionUseCase {
  abstract execute ( createPermissionDto: CreatePermissionDto ): Promise<PermissionEntity>
}