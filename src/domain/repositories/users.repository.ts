import { UserEntity, PaginatedResponseEntity } from '../entities'
import { EntityIdVO, EmailVO } from '../value-objects'

export interface PaginationParams {
  page: number
  pageSize: number
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
}

export abstract class UsersRepository {
  abstract create(
    name: string,
    lastName: string,
    email: EmailVO,
    hashedPassword: string
  ): Promise<UserEntity>
  abstract update(
    id: EntityIdVO,
    data: {
      name?: string
      lastName?: string
      isActive?: boolean
    }
  ): Promise<UserEntity>
  abstract delete( id: EntityIdVO ): Promise<void>
  abstract findById( id: EntityIdVO ): Promise<UserEntity | null>
  abstract findByEmail( email: EmailVO ): Promise<UserEntity | null>
  abstract findMany( params: PaginationParams ): Promise<PaginatedResponseEntity<UserEntity[]>>
  abstract assignRole( userId: EntityIdVO, roleId: EntityIdVO ): Promise<void>
  abstract removeRole( userId: EntityIdVO, roleId: EntityIdVO ): Promise<void>
  abstract emailExists( email: EmailVO ): Promise<boolean>
}