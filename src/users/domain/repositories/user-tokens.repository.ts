import { RepositoryInterface } from '@/common/domain/repositories/repository.interface'
import { UserModel } from '../models/users.model'
import { UserTokensModel } from '../models/user-token.model'

export type CreateUserTokenProps = {
  user_id: string
}

export interface UsersTokensRepository
  extends RepositoryInterface<UserTokensModel, CreateUserTokenProps> {
  generate(props: CreateUserTokenProps): Promise<UserTokensModel>
  findByToken(token: string): Promise<UserTokensModel>
}
