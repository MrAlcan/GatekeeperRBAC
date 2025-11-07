import type { ListRolesDto } from '@/domain/dtos'
import type { RoleEntity } from '@/domain/entities'

export abstract class ListRolesUseCase {
  abstract execute ( listRolesDto: ListRolesDto ): Promise<RoleEntity[]>
}