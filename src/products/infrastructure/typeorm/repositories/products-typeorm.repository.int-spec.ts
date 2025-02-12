import { testDataSource } from '@/common/infrastructure/typeorm/testing/data-source'
import { ProductsTypeormRepository } from './products-typeorm.repository'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { randomUUID } from 'crypto'
import { ProductsDataBuilder } from '../../testing/helpers/products-data-builder'
import { Product } from '../entities/products.entitiy'

describe('ProductsTypeormRepository integration Tests', () => {
  let ormRepository: ProductsTypeormRepository

  //Once running configurations before all tests
  beforeAll(async () => {
    //Initialize the test data source to use the database
    await testDataSource.initialize()
  })

  //Before each test we need to create a new instance of the repository
  beforeEach(async () => {
    //Clean the database before each test
    await testDataSource.manager.query('DELETE FROM products')

    //Instantiate the repository with the Products repository
    ormRepository = new ProductsTypeormRepository()
    ormRepository.productsRepository = testDataSource.getRepository('products')
  })

  //Once running configurations after all tests
  afterAll(async () => {
    //Destroy the test data source to clean the database
    await testDataSource.destroy()
  })

  describe('findById', () => {
    it('Should throw error when id not found in findById', async () => {
      const id = randomUUID()

      await expect(ormRepository.findById(id)).rejects.toThrow(
        new NotFoundError(`Product not found unsing id ${id}`),
      )
    })

    it('Should find a product by id in findById', async () => {
      const data = ProductsDataBuilder({})
      const product = testDataSource.manager.create(Product, data)
      await testDataSource.manager.save(product)

      const result = await ormRepository.findById(product.id)
      expect(result.id).toEqual(product.id)
      expect(result.name).toEqual(product.name)
    })
  })

  describe('create', () => {
    it('Should create a new product object', () => {
      const data = ProductsDataBuilder({
        name: 'Product 1',
      })
      const result = ormRepository.create(data)
      expect(result.name).toEqual(data.name)
    })
  })

  describe('insert', () => {
    it('Should insert a new product object', async () => {
      const data = ProductsDataBuilder({
        name: 'Product 1',
      })
      const result = await ormRepository.insert(data)
      expect(result.name).toEqual(data.name)
    })
  })
})
