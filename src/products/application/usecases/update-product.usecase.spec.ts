import 'reflect-metadata'
import { ProductsRepository } from '@/products/domain/repositories/products.repository'
import { ProductsInMemoryRepository } from '@/products/infrastructure/in-memory/repositories/products-in-memory.repository'
import { UpdateProductUseCase } from './update-product.usecase'
import { NotFoundError } from '@/common/domain/errors/not-found-error'

describe('UpdateProductUsecase Unit Tests', () => {
  let sut: UpdateProductUseCase.UseCase
  let repository: ProductsRepository

  beforeEach(() => {
    repository = new ProductsInMemoryRepository()
    sut = new UpdateProductUseCase.UseCase(repository)
  })

  it('Should update a product with all params', async () => {
    //Ensure that the product will be created
    const spyUpdate = jest.spyOn(repository, 'update')

    const props = {
      name: 'Product 1',
      price: 10,
      quantity: 10,
    }

    const result = await repository.create(props)
    await repository.insert(result)

    const updateProps = {
      id: result.id,
      name: 'Product 1',
      price: 20,
      quantity: 15,
    }

    const updateResult = await sut.execute(updateProps)

    expect(updateResult).toMatchObject(result)
    expect(spyUpdate).toHaveBeenCalledTimes(1)
  })

  it('Should update a product with only one param', async () => {
    //Ensure that the product will be created
    const spyUpdate = jest.spyOn(repository, 'update')

    const props = {
      name: 'Product 1',
      price: 10,
      quantity: 10,
    }

    const result = await repository.create(props)
    await repository.insert(result)

    const updateProps = {
      id: result.id,
      name: 'Product Test',
    }

    const updateResult = await sut.execute(updateProps)

    expect(updateResult).toMatchObject(result)
    expect(spyUpdate).toHaveBeenCalledTimes(1)
  })

  it('Should not found a product to update', async () => {
    const updateProps = {
      id: 'fake-id',
      name: 'Product Test',
      price: 10,
      quantity: 10,
    }

    const updateResult = await expect(
      sut.execute(updateProps),
    ).rejects.toBeInstanceOf(NotFoundError)
  })
})
