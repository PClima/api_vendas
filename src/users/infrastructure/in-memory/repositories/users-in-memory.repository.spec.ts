import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { UsersInMemoryRepository } from './users-in-memory.repository'
import { UsersDataBuilder } from '../../testing/helpers/users-data-builder'
import { ConflictError } from '@/common/domain/errors/conflict-error'
describe('UsersInMemoryRepository unit tests', () => {
  let sut: UsersInMemoryRepository
  beforeEach(() => {
    sut = new UsersInMemoryRepository()
    sut.items = []
  })

  describe('findByEmail', () => {
    it('should throw error when user not found by email', async () => {
      await expect(() =>
        sut.findByEmail('fake.email@email.com'),
      ).rejects.toThrow(
        new NotFoundError('User not found using email fake.email@email.com'),
      )
      //Same verification with other way
      await expect(() =>
        sut.findByEmail('fake.email@email.com'),
      ).rejects.toBeInstanceOf(NotFoundError)
    })
    it('should find a user by email', async () => {
      const data = UsersDataBuilder({ email: 'email@email.com' })
      sut.items.push(data)
      const result = await sut.findByEmail('email@email.com')
      expect(result).toStrictEqual(data)
    })
  })

  describe('findByName', () => {
    it('should throw error when user not found by name', async () => {
      await expect(() => sut.findByName('fake_name')).rejects.toThrow(
        new NotFoundError('User not found using name fake_name'),
      )
      //Same verification with other way
      await expect(() => sut.findByName('fake_name')).rejects.toBeInstanceOf(
        NotFoundError,
      )
    })
    it('should find a user by name', async () => {
      const data = UsersDataBuilder({ name: 'Curso nodejs' })
      sut.items.push(data)
      const result = await sut.findByName('Curso nodejs')
      expect(result).toStrictEqual(data)
    })
  })

  describe('conflictingEmail', () => {
    it('should throw error when user found by email', async () => {
      const data = UsersDataBuilder({ email: 'email@email.com' })
      sut.items.push(data)
      await expect(() =>
        sut.conflictingEmail('email@email.com'),
      ).rejects.toThrow(new ConflictError('Email already used by other user'))
      await expect(() =>
        sut.conflictingEmail('email@email.com'),
      ).rejects.toBeInstanceOf(ConflictError)
    })
    it('should not find a user by email', async () => {
      expect.assertions(0)
      await sut.conflictingEmail('email@email.com')
    })
  })

  describe('applyFilter', () => {
    //Testing the applyFilter method error case and check if the filter is not being called
    it('should no filter users when filter parameter is null', async () => {
      const data = UsersDataBuilder({})
      sut.items.push(data)
      const spyFilterMethod = jest.spyOn(sut.items, 'filter' as any)
      const result = await sut['applyFilter'](sut.items, null)
      expect(spyFilterMethod).not.toHaveBeenCalled()
      expect(result).toStrictEqual(sut.items)
    })

    //Testing the applyFilter method success cases and check if the filter is being called correctly
    it('should filter users with filter param', async () => {
      const items = [
        UsersDataBuilder({ name: 'TEST' }),
        UsersDataBuilder({ name: 'Test' }),
        UsersDataBuilder({ name: 'fake' }),
      ]
      sut.items.push(...items)

      const spyFilterMethod = jest.spyOn(sut.items, 'filter' as any)
      let result = await sut['applyFilter'](sut.items, 'TEST')
      expect(spyFilterMethod).toHaveBeenCalledTimes(1)
      expect(result).toStrictEqual([items[0], items[1]])

      result = await sut['applyFilter'](sut.items, 'test')
      expect(spyFilterMethod).toHaveBeenCalledTimes(2)
      expect(result).toStrictEqual([items[0], items[1]])

      result = await sut['applyFilter'](sut.items, 'fake')
      expect(spyFilterMethod).toHaveBeenCalledTimes(3)
      expect(result).toStrictEqual([items[2]])

      result = await sut['applyFilter'](sut.items, 'no-filter')
      expect(spyFilterMethod).toHaveBeenCalledTimes(4)
      expect(result).toHaveLength(0)
    })
  })

  describe('applySort', () => {
    //Testing the applySort method error case when sort is null or sortableFilters does not include the sort
    it('should not sort users', async () => {
      const items = [
        UsersDataBuilder({ name: 'test', email: 'a@email.com' }),
        UsersDataBuilder({ name: 'TEST', email: 'b@email.com' }),
        UsersDataBuilder({ name: 'fake', email: 'c@email.com' }),
      ]
      sut.items.push(...items)
      let result = await sut['applySort'](sut.items, null, null)
      expect(result).toStrictEqual(items)

      result = await sut['applySort'](sut.items, 'email', 'asc')
      expect(result).toStrictEqual(items)
    })

    //Testing the applySort method success case
    it('should sort items', async () => {
      const items = [
        UsersDataBuilder({ name: 'b', email: 'b@email.com' }),
        UsersDataBuilder({ name: 'a', email: 'a@email.com' }),
        UsersDataBuilder({ name: 'c', email: 'c@email.com' }),
      ]
      sut.items.push(...items)
      let result = await sut['applySort'](sut.items, 'name', 'desc')
      expect(result).toStrictEqual([items[2], items[0], items[1]])

      result = await sut['applySort'](sut.items, 'name', 'asc')
      expect(result).toStrictEqual([items[1], items[0], items[2]])
    })
  })
})
