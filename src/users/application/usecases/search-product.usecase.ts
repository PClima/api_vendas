import { UsersRepository } from '@/users/domain/repositories/users.repository'
import { inject, injectable } from 'tsyringe'
import { SearchInputDto } from '@/common/application/dtos/search-input.dto'
import {
  PaginationOutputDto,
  PaginationOutputMapper,
} from '../../../common/application/dtos/pagination-output.dto'
import { UserModel } from '@/users/domain/models/users.model'

export namespace SearchUserUseCase {
  export type Input = SearchInputDto

  export type Output = PaginationOutputDto<UserModel>

  @injectable()
  export class UseCase {
    constructor(
      @inject('UsersRepository')
      private usersRepository: UsersRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const searchResult = await this.usersRepository.search(input)
      return PaginationOutputMapper.toOutput(searchResult.items, searchResult)
    }
  }
}
