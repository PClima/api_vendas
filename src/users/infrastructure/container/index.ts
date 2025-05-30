import { container } from 'tsyringe'
import { UsersTypeormRepository } from '../typeorm/repositories/users-typeorm.repository'
import { dataSource } from '@/common/infrastructure/typeorm'
import { User } from '../typeorm/entities/users.entity'
import { CreateUserUseCase } from '@/users/application/usecases/create-user.usecase'
import { SearchUserUseCase } from '@/users/application/usecases/search-product.usecase'
import { AuthenticateUserUseCase } from '@/users/application/usecases/authenticate-user.usecase'
import { UpdateAvatarUseCase } from '@/users/application/usecases/update-avatar.usecase'
import { GetAvatarUseCase } from '@/users/application/usecases/get-avatar.usecase'
import { UserTokensTypeormRepository } from '../typeorm/repositories/user-tokens-typeorm.repository'
import { UserTokens } from '../typeorm/entities/user-tokens.entity'

container.registerSingleton('UsersRepository', UsersTypeormRepository)
container.registerInstance(
  'UsersDefaultTypeormRepository',
  dataSource.getRepository(User),
)
container.registerSingleton('UserTokensRepository', UserTokensTypeormRepository)
container.registerInstance(
  'UserTokensDefaultTypeormRepository',
  dataSource.getRepository(UserTokens),
)

container.registerSingleton('CreateUserUseCase', CreateUserUseCase.UseCase)
container.registerSingleton('SearchUserUseCase', SearchUserUseCase.UseCase)
container.registerSingleton(
  'AuthenticateUserUseCase',
  AuthenticateUserUseCase.UseCase,
)
container.registerSingleton('UpdateAvatarUseCase', UpdateAvatarUseCase.UseCase)
container.registerSingleton('GetAvatarUseCase', GetAvatarUseCase.UseCase)
