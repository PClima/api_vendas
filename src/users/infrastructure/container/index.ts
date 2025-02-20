import { container } from 'tsyringe'
import { UsersTypeormRepository } from '../typeorm/repositories/users-typeorm.repository'
import { dataSource } from '@/common/infrastructure/typeorm'
import { User } from '../typeorm/entities/users.entity'
import { CreateUserUseCase } from '@/users/application/usecases/create-user.usecase'
import { SearchUserUseCase } from '@/users/application/usecases/search-product.usecase'

container.registerSingleton('UsersRepository', UsersTypeormRepository)
container.registerInstance(
  'UsersDefaultTypeormRepository',
  dataSource.getRepository(User),
)

container.registerSingleton('CreateUserUseCase', CreateUserUseCase.UseCase)
container.registerSingleton('SearchUserUseCase', SearchUserUseCase.UseCase)
