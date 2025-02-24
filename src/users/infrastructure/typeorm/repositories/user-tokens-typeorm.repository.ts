import {
  SearchInput,
  SearchOutput,
} from '@/common/domain/repositories/repository.interface'
import { ILike, Repository } from 'typeorm'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { inject, injectable } from 'tsyringe'
import { UsersRepository } from '@/users/domain/repositories/users.repository'
import {
  CreateUserTokenProps,
  UsersTokensRepository,
} from '@/users/domain/repositories/user-tokens.repository'
import { UserTokensModel } from '@/users/domain/models/user-token.model'
import { UserTokens } from '../entities/user-tokens.entity'

@injectable()
export class UserTokensTypeormRepository implements UsersTokensRepository {
  sortableFields: string[] = ['created_at', 'updated_at']

  constructor(
    @inject('UserTokensDefaultTypeormRepository')
    private userTokensRepository: Repository<UserTokens>,
    @inject('UsersRepository')
    private usersRepository: UsersRepository,
  ) {}

  create(props: CreateUserTokenProps): UserTokensModel {
    return this.userTokensRepository.create(props)
  }

  async insert(model: UserTokensModel): Promise<UserTokensModel> {
    return this.userTokensRepository.save(model)
  }

  async findById(id: string): Promise<UserTokensModel> {
    return this._get(id)
  }

  async update(model: UserTokensModel): Promise<UserTokensModel> {
    await this._get(model.id)
    await this.userTokensRepository.update({ id: model.id }, model)
    return model
  }

  async delete(id: string): Promise<void> {
    await this._get(id)
    await this.userTokensRepository.delete({ id })
  }

  async search(props: SearchInput): Promise<SearchOutput<UserTokensModel>> {
    //Validating the sort and sort_dir fields are correct
    const validSort = this.sortableFields.includes(props.sort) || false
    const dirOps = ['asc', 'desc']
    const validSortDir =
      (props.sort_dir && dirOps.includes(props.sort_dir.toLowerCase())) || false

    //Setting the orderByField and orderByDir based on the validation, if no set default values
    const orderByField = validSort ? props.sort : 'created_at'
    const orderByDir = validSortDir ? props.sort_dir : 'desc'

    const [userTokens, total] = await this.userTokensRepository.findAndCount({
      ...(props.filter && { where: { token: ILike(`%${props.filter}%`) } }),
      order: { [orderByField]: orderByDir },
      take: props.per_page,
      skip: (props.page - 1) * props.per_page,
    })

    return {
      items: userTokens,
      per_page: props.per_page,
      total,
      current_page: props.page,
      sort: orderByField,
      sort_dir: orderByDir,
      filter: props.filter,
    }
  }

  async generate(props: CreateUserTokenProps): Promise<UserTokensModel> {
    const user = await this.usersRepository.findById(props.user_id)

    const userToken = this.userTokensRepository.create({
      user_id: user.id,
    })

    return this.userTokensRepository.save(userToken)
  }

  async findByToken(token: string): Promise<UserTokensModel> {
    const userToken = await this.userTokensRepository.findOneBy({ token })

    if (!userToken) {
      throw new NotFoundError(`User Token not found using token ${token}`)
    }

    return userToken
  }

  protected async _get(id: string): Promise<UserTokensModel> {
    const user = await this.userTokensRepository.findOneBy({ id })
    if (!user) {
      throw new NotFoundError(`User Token not found using ID ${id}`)
    }
    return user
  }
}
