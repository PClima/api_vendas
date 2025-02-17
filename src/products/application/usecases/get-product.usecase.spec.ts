import 'reflect-metadata'
import { ProductsRepository } from '@/products/domain/repositories/products.repository'
import { ProductsInMemoryRepository } from '@/products/infrastructure/in-memory/repositories/products-in-memory.repository'
import { GetProductUseCase } from './get-product.usecase'
import { NotFoundError } from '@/common/domain/errors/not-found-error'

describe('GetProductUsecase Unit Tests', () => {
  let sut: GetProductUseCase.UseCase
  let repository: ProductsRepository

  beforeEach(() => {
    repository = new ProductsInMemoryRepository()
    sut = new GetProductUseCase.UseCase(repository)
  })

  it('Should get a product by id', async () => {
    //Ensure that the product will be created
    const spyFindById = jest.spyOn(repository, 'findById')

    //Creating the product input
    const props = {
      name: 'Product 1',
      price: 10,
      quantity: 10,
    }

    const model = repository.create(props)
    await repository.insert(model)

    const result = await sut.execute({ id: model.id })
    expect(result).toMatchObject(model)
    expect(spyFindById).toHaveBeenCalledTimes(1)
  })

  it('Should throws error when product not found by id', async () => {
    //Trying to create another product with the same name
    await expect(sut.execute({ id: 'fake-id' })).rejects.toBeInstanceOf(
      NotFoundError,
    )
  })
})
