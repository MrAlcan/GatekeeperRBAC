import type { PaginationDto } from "@/domain/dtos";
import type { PaginationEntity, UserEntity } from "@/domain/entities";
import type { UsersRepository } from "@/domain/repositories";
import type { PaginatedResponseEntity } from "@/domain/entities";
import { CustomError } from "@/domain/errors";

export interface ListUsersResponseDto {
  success: boolean
  data: UserEntity[]
  pagination: PaginationEntity
}

export class ListUsersUseCase {
  constructor (
    private readonly usersRepository: UsersRepository
  ) {}
  async execute ( paginationDto: PaginationDto ): Promise<ListUsersResponseDto> {
    const users: PaginatedResponseEntity<UserEntity[]> = await this.usersRepository.listUsers( paginationDto )
    if ( !users ) {
      throw CustomError.notFound( 'errors.listUsers.users.notFound' )
    }
    return { success: true, data: users.data, pagination: users.pagination }
  }
}