import { testDataSource } from '@/common/infrastructure/typeorm/testing/data-source'
import { UsersTypeormRepository } from './users-typeorm.repository'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { randomUUID } from 'crypto'
import { UsersDataBuilder } from '../../testing/helpers/users-data-builder'
import { User } from '../entities/users.entity'
import { ConflictError } from '@/common/domain/errors/conflict-error'
import { ProductModel } from '@/products/domain/models/products.model'
import { UserModel } from '@/users/domain/models/users.model'

describe('UsersTypeormRepository integration Tests', () => {
  let ormRepository: UsersTypeormRepository
  let typeormEntityManager: any

  //Once running configurations before all tests
  beforeAll(async () => {
    //Initialize the test data source to use the database
    await testDataSource.initialize()
    typeormEntityManager = testDataSource.createEntityManager()
  })

  //Before each test we need to create a new instance of the repository
  beforeEach(async () => {
    //Clean the database before each test
    await testDataSource.manager.query('DELETE FROM users')

    //Instantiate the repository with the Products repository
    ormRepository = new UsersTypeormRepository(
      typeormEntityManager.getRepository(User),
    )
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
        new NotFoundError(`User not found unsing id ${id}`),
      )
    })

    it('Should find a product by id in findById', async () => {
      const data = UsersDataBuilder({})
      const user = testDataSource.manager.create(User, data)
      await testDataSource.manager.save(user)

      const result = await ormRepository.findById(user.id)
      expect(result.id).toEqual(user.id)
      expect(result.name).toEqual(user.name)
    })
  })

  describe('findByEmail', () => {
    it('Should throw error when email not found in findByEmail', async () => {
      await expect(
        ormRepository.findByEmail('email@email.com'),
      ).rejects.toThrow(
        new NotFoundError(`User not found unsing email email@email.com`),
      )
    })

    it('Should find a user by email in findByEmail', async () => {
      const data = UsersDataBuilder({})
      const user = testDataSource.manager.create(User, data)
      await testDataSource.manager.save(user)

      const result = await ormRepository.findByEmail(user.email)
      expect(result.id).toEqual(user.id)
      expect(result.name).toEqual(user.name)
    })
  })

  describe('findByName', () => {
    it('Should throw error when name not found in findByName', async () => {
      await expect(ormRepository.findByName('fake-name')).rejects.toThrow(
        new NotFoundError(`User not found unsing email fake-name`),
      )
    })

    it('Should find a product by id in findByName', async () => {
      const data = UsersDataBuilder({})
      const user = testDataSource.manager.create(User, data)
      await testDataSource.manager.save(user)

      const result = await ormRepository.findByName(user.name)
      expect(result.id).toEqual(user.id)
      expect(result.name).toEqual(user.name)
    })
  })

  describe('create', () => {
    it('Should create a new user object', () => {
      const data = UsersDataBuilder({
        name: 'User 01',
      })
      const result = ormRepository.create(data)
      expect(result.name).toEqual(data.name)
    })
  })

  describe('insert', () => {
    it('Should insert a new user object', async () => {
      const data = UsersDataBuilder({
        name: 'User 01',
      })
      const result = await ormRepository.insert(data)
      expect(result.name).toEqual(data.name)
    })
  })

  describe('update', () => {
    it('Should throw error when id not found in update', async () => {
      const data = UsersDataBuilder({})

      await expect(ormRepository.update(data)).rejects.toThrow(
        new NotFoundError(`User not found unsing id ${data.id}`),
      )
    })

    it('Should update a user by id in update', async () => {
      const data = UsersDataBuilder({})
      const user = testDataSource.manager.create(User, data)
      await testDataSource.manager.save(user)
      user.name = 'Updated user'

      const result = await ormRepository.update(user)
      expect(result.name).toEqual('Updated user')
    })
  })

  describe('delete', () => {
    it('Should throw error when id not found in delete', async () => {
      const id = randomUUID()

      await expect(ormRepository.delete(id)).rejects.toThrow(
        new NotFoundError(`User not found unsing id ${id}`),
      )
    })

    it('Should delete a user by id in delete', async () => {
      const data = UsersDataBuilder({})
      const user = testDataSource.manager.create(User, data)
      await testDataSource.manager.save(user)

      await ormRepository.delete(data.id)

      const result = await testDataSource.manager.findOneBy(User, {
        id: data.id,
      })
      expect(result).toBeNull()
    })
  })

  describe('conflictingEmail', () => {
    it('Should throw error when found a user by name in conflictingEmail', async () => {
      const data = UsersDataBuilder({ email: 'email@email.com' })
      const user = testDataSource.manager.create(User, data)
      await testDataSource.manager.save(user)

      await expect(
        ormRepository.conflictingEmail('email@email.com'),
      ).rejects.toThrow(
        new ConflictError(`Email '${data.email}' already used on another user`),
      )
    })

    it('Should not find a user by email in conflictingEmail', async () => {
      expect.assertions(0)
      await ormRepository.conflictingEmail('email@email.com')
    })
  })

  describe('search', () => {
    it('Should apply only pagination when other params is null', async () => {
      const arrange = Array(16).fill(UsersDataBuilder({}))
      arrange.map(element => delete element.id)
      const data = testDataSource.manager.create(User, arrange)
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
      const arrange = Array(16).fill(UsersDataBuilder({}))
      arrange.forEach((element, index) => {
        delete element.id
        models.push({
          ...element,
          name: `User ${index}`,
          created_at: new Date(created_at.getTime() + index),
        })
      })
      const data = testDataSource.manager.create(User, models)
      await testDataSource.manager.save(data)

      const result = await ormRepository.search({
        page: 1,
        per_page: 10,
        sort: null,
        sort_dir: null,
        filter: null,
      })

      expect(result.items[0].name).toEqual('User 15')
      expect(result.items[9].name).toEqual('User 6')
    })

    it('Should apply paginate and sort', async () => {
      const created_at = new Date()
      const models: UserModel[] = []
      'badec'.split('').forEach((element, index) => {
        models.push({
          ...UsersDataBuilder({}),
          name: element,
          created_at: new Date(created_at.getTime() + index),
        })
      })
      const data = testDataSource.manager.create(User, models)
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
      const models: UserModel[] = []
      const values = ['test', 'a', 'TEST', 'b', 'TeSt']
      values.forEach((element, index) => {
        models.push({
          ...UsersDataBuilder({}),
          name: element,
          created_at: new Date(created_at.getTime() + index),
        })
      })
      const data = testDataSource.manager.create(User, models)
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
