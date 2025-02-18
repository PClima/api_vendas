import { CreateProductUseCase } from '@/products/application/usecases/create-product.usecase'
import { ProductsTypeormRepository } from '@/products/infrastructure/typeorm/repositories/products-typeorm.repository'
import { container } from 'tsyringe'
import { dataSource } from '@/common/infrastructure/typeorm'
import { Product } from '@/products/infrastructure/typeorm/entities/products.entitiy'
import { GetProductUseCase } from '@/products/application/usecases/get-product.usecase'
import { UpdateProductUseCase } from '@/products/application/usecases/update-product.usecase'
import { DeleteProductUseCase } from '@/products/application/usecases/delete-product.usecase'
import { SearchProductUseCase } from '@/products/application/usecases/search-product.usecase'

container.registerSingleton('ProductRepository', ProductsTypeormRepository)
container.registerInstance(
  'ProductsDefaultTypeormRepository',
  dataSource.getRepository(Product),
)
container.registerSingleton(
  'CreateProductUseCase',
  CreateProductUseCase.UseCase,
)
container.registerSingleton('GetProductUseCase', GetProductUseCase.UseCase)
container.registerSingleton(
  'UpdateProductUseCase',
  UpdateProductUseCase.UseCase,
)
container.registerSingleton(
  'DeleteProductUseCase',
  DeleteProductUseCase.UseCase,
)
container.registerSingleton(
  'SearchProductUseCase',
  SearchProductUseCase.UseCase,
)
