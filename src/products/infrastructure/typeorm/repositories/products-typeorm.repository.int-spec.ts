import { testDataSource } from '@/common/infrastructure/typeorm/testing/data-source'
import { ProductsTypeormRepository } from './products-typeorm.repository'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { randomUUID } from 'crypto'
import { ProductsDataBuilder } from '../../testing/helpers/products-data-builder'
import { Product } from '../entities/products.entitiy'
import { ConflictError } from '@/common/domain/errors/conflict-error'
import { ProductModel } from '@/products/domain/models/products.model'

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

  describe('update', () => {
    it('Should throw error when id not found in update', async () => {
      const data = ProductsDataBuilder({})

      await expect(ormRepository.update(data)).rejects.toThrow(
        new NotFoundError(`Product not found unsing id ${data.id}`),
      )
    })

    it('Should update a product by id in update', async () => {
      const data = ProductsDataBuilder({})
      const product = testDataSource.manager.create(Product, data)
      await testDataSource.manager.save(product)
      product.name = 'Updated name'

      const result = await ormRepository.update(product)
      expect(result.name).toEqual('Updated name')
    })
  })

  describe('delete', () => {
    it('Should throw error when id not found in delete', async () => {
      const id = randomUUID()

      await expect(ormRepository.delete(id)).rejects.toThrow(
        new NotFoundError(`Product not found unsing id ${id}`),
      )
    })

    it('Should delete a product by id in delete', async () => {
      const data = ProductsDataBuilder({})
      const product = testDataSource.manager.create(Product, data)
      await testDataSource.manager.save(product)

      await ormRepository.delete(data.id)

      const result = await ormRepository.productsRepository.findOneBy({
        id: data.id,
      })
      expect(result).toBeNull()
    })
  })

  describe('findByName', () => {
    it('Should throw error when name not found in findByName', async () => {
      const name = 'fake-name'

      await expect(ormRepository.findByName(name)).rejects.toThrow(
        new NotFoundError(`Product not found unsing name fake-name`),
      )
    })

    it('Should find a product by name in findByName', async () => {
      const data = ProductsDataBuilder({ name: 'test-name' })
      const product = testDataSource.manager.create(Product, data)
      await testDataSource.manager.save(product)

      const result = await ormRepository.findByName(product.name)
      expect(result.name).toEqual('test-name')
    })
  })

  describe('conflictingName', () => {
    it('Should throw error when found a product by name in conflictingName', async () => {
      const data = ProductsDataBuilder({ name: 'test-name' })
      const product = testDataSource.manager.create(Product, data)
      await testDataSource.manager.save(product)

      await expect(ormRepository.conflictingName('test-name')).rejects.toThrow(
        new ConflictError(`Name 'test-name' already used on another product`),
      )
    })

    it('Should not find a product by name in conflictingName', async () => {
      expect.assertions(0)
      await ormRepository.conflictingName('fake-name')
    })
  })

  describe('findAllByIds', () => {
    it('Should return a empty array when not found any products in findAllByIds', async () => {
      const productsIds = [
        { id: '88984790-f719-496b-bee6-ccda23b64f05' },
        { id: randomUUID() },
      ]

      const result = await ormRepository.findAllByIds(productsIds)
      expect(result).toHaveLength(0)
      expect(result).toEqual([])
    })

    it('Should return a array with products when found products in findAllByIds', async () => {
      const data = [
        ProductsDataBuilder({ name: 'Product 1' }),
        ProductsDataBuilder({ name: 'Product 2' }),
      ]
      const product = testDataSource.manager.create(Product, data)
      await testDataSource.manager.save(product)

      const productsIds = product.map(item => ({ id: item.id }))
      //First test should return only one product
      let result = await ormRepository.findAllByIds([productsIds[0]])
      expect(result).toHaveLength(1)
      //Second test should return all products
      result = await ormRepository.findAllByIds(productsIds)
      expect(result).toHaveLength(2)
    })
  })

  describe('search', () => {
    it('Should apply only pagination when other params is null', async () => {
      const arrange = Array(16).fill(ProductsDataBuilder({}))
      arrange.map(element => delete element.id)
      const data = testDataSource.manager.create(Product, arrange)
      await testDataSource.manager.save(data)

      const result = await ormRepository.search({
        page: 1,
        per_page: 10,
        sort: null,
        sort_dir: null,
        filter: null,
      })

      expect(result.total).toEqual(16)
      expect(result.items).toHaveLength(10)
      expect(result.sort).toEqual('created_at')
    })

    it('Should order by created_at DESC when search params are null', async () => {
      const created_at = new Date()
      const models: ProductModel[] = []
      const arrange = Array(16).fill(ProductsDataBuilder({}))
      arrange.forEach((element, index) => {
        delete element.id
        models.push({
          ...element,
          name: `Product ${index}`,
          created_at: new Date(created_at.getTime() + index),
        })
      })
      const data = testDataSource.manager.create(Product, models)
      await testDataSource.manager.save(data)

      const result = await ormRepository.search({
        page: 1,
        per_page: 10,
        sort: null,
        sort_dir: null,
        filter: null,
      })

      expect(result.items[0].name).toEqual('Product 15')
      expect(result.items[9].name).toEqual('Product 6')
    })

    it('Should apply paginate and sort', async () => {
      const created_at = new Date()
      const models: ProductModel[] = []
      'badec'.split('').forEach((element, index) => {
        models.push({
          ...ProductsDataBuilder({}),
          name: element,
          created_at: new Date(created_at.getTime() + index),
        })
      })
      const data = testDataSource.manager.create(Product, models)
      await testDataSource.manager.save(data)

      let result = await ormRepository.search({
        page: 1,
        per_page: 2,
        sort: 'name',
        sort_dir: 'asc',
        filter: null,
      })

      expect(result.items[0].name).toEqual('a')
      expect(result.items[1].name).toEqual('b')
      expect(result.items.length).toEqual(2)

      result = await ormRepository.search({
        page: 1,
        per_page: 2,
        sort: 'name',
        sort_dir: 'desc',
        filter: null,
      })

      expect(result.items[0].name).toEqual('e')
      expect(result.items[1].name).toEqual('d')
      expect(result.items.length).toEqual(2)
    })

    it('should search using filter, sort and paginate', async () => {
      const created_at = new Date()
      const models: ProductModel[] = []
      const values = ['test', 'a', 'TEST', 'b', 'TeSt']
      values.forEach((element, index) => {
        models.push({
          ...ProductsDataBuilder({}),
          name: element,
          created_at: new Date(created_at.getTime() + index),
        })
      })
      const data = testDataSource.manager.create(Product, models)
      await testDataSource.manager.save(data)

      let result = await ormRepository.search({
        page: 1,
        per_page: 2,
        sort: 'name',
        sort_dir: 'asc',
        filter: 'TEST',
      })

      expect(result.items[0].name).toEqual('test')
      expect(result.items[1].name).toEqual('TeSt')
      expect(result.items.length).toEqual(2)
      expect(result.total).toEqual(3)

      result = await ormRepository.search({
        page: 2,
        per_page: 2,
        sort: 'name',
        sort_dir: 'asc',
        filter: 'TEST',
      })

      expect(result.items[0].name).toEqual('TEST')
      expect(result.items.length).toEqual(1)
      expect(result.total).toEqual(3)
    })
  })
})
