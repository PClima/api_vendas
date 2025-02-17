import 'reflect-metadata'
import { ProductsRepository } from '@/products/domain/repositories/products.repository'
import { CreateProductUseCase } from './create-product.usecase'
import { ProductsInMemoryRepository } from '@/products/infrastructure/in-memory/repositories/products-in-memory.repository'
import { ConflictError } from '@/common/domain/errors/conflict-error'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'

describe('CreateProductUsecase Unit Tests', () => {
  let sut: CreateProductUseCase.UseCase
  let repository: ProductsRepository

  beforeEach(() => {
    repository = new ProductsInMemoryRepository()
    sut = new CreateProductUseCase.UseCase(repository)
  })

  it('Should create a product', async () => {
    //Ensure that the product will be created
    const spyInsert = jest.spyOn(repository, 'insert')

    //Creating the product input
    const props = {
      name: 'Product 1',
      price: 10,
      quantity: 10,
    }

    const result = await sut.execute(props)
    expect(result.id).toBeDefined()
    expect(result.created_at).toBeDefined()
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })

  it('Should not be possible to register a product with the name of another product', async () => {
    const props = {
      name: 'Product 1',
      price: 10,
      quantity: 10,
    }

    //Creating the product
    await sut.execute(props)

    //Trying to create another product with the same name
    await expect(sut.execute(props)).rejects.toBeInstanceOf(ConflictError)
  })

  it('Should thorw an error when the name not provided', async () => {
    const props = {
      name: null,
      price: 10,
      quantity: 10,
    }
    //Trying to create another product with the same name
    await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })

  it('Should thorw an error when the price not provided', async () => {
    const props = {
      name: 'Product 1',
      price: 0,
      quantity: 10,
    }
    //Trying to create another product with the same name
    await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })

  it('Should thorw an error when the quantity not provided', async () => {
    const props = {
      name: 'Product 1',
      price: 10,
      quantity: 0,
    }
    //Trying to create another product with the same name
    await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })
})
