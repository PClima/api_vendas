import 'reflect-metadata'
import { ProductsInMemoryRepository } from '@/products/infrastructure/in-memory/repositories/products-in-memory.repository'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { DeleteProductUseCase } from './delete-product.usecase'

describe('DeleteProductUseCase Unit Tests', () => {
  let sut: DeleteProductUseCase.UseCase
  let repository: ProductsInMemoryRepository

  beforeEach(() => {
    repository = new ProductsInMemoryRepository()
    sut = new DeleteProductUseCase.UseCase(repository)
  })

  test('should throws error when product not found', async () => {
    await expect(sut.execute({ id: 'fake-id' })).rejects.toBeInstanceOf(
      NotFoundError,
    )
  })

  it('should be able to delete a product', async () => {
    const spyUpdate = jest.spyOn(repository, 'delete')
    const props = {
      name: 'Product 1',
      price: 10,
      quantity: 5,
    }
    const model = repository.create(props)
    await repository.insert(model)

    await sut.execute({ id: model.id })

    expect(repository.findById(model.id)).rejects.toBeInstanceOf(NotFoundError)
    expect(spyUpdate).toHaveBeenCalledTimes(1)
  })
})
