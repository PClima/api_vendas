import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { ProductsInMemoryRepository } from './products-in-memory.repository'
import { ProductsDataBuilder } from '../../testing/helpers/products-data-builder'
import { ConflictError } from '@/common/domain/errors/conflict-error'
describe('ProductsInMemoryRepository unit tests', () => {
  let sut: ProductsInMemoryRepository
  beforeEach(() => {
    sut = new ProductsInMemoryRepository()
  })

  describe('findByName', () => {
    it('should throw error when product not found', async () => {
      await expect(() => sut.findByName('fake_name')).rejects.toThrow(
        new NotFoundError('Product not found using name fake_name'),
      )
      //Same verification with other way
      await expect(() => sut.findByName('fake_name')).rejects.toBeInstanceOf(
        NotFoundError,
      )
    })
    it('should find a product by name', async () => {
      const data = ProductsDataBuilder({ name: 'Curso nodejs' })
      sut.items.push(data)
      const result = await sut.findByName('Curso nodejs')
      expect(result).toStrictEqual(data)
    })
  })

  describe('conflictingName', () => {
    it('should throw error when product found', async () => {
      const data = ProductsDataBuilder({ name: 'Curso nodejs' })
      sut.items.push(data)
      await expect(() => sut.conflictingName('Curso nodejs')).rejects.toThrow(
        new ConflictError('Name already used on another product'),
      )
      await expect(() =>
        sut.conflictingName('Curso nodejs'),
      ).rejects.toBeInstanceOf(ConflictError)
    })
    it('should not find a product by name', async () => {
      expect.assertions(0)
      await sut.conflictingName('Curso nodejs')
    })
  })

  describe('applyFilter', () => {
    //Testing the applyFilter method error case and check if the filter is not being called
    it('should no filter items when filter parameter is null', async () => {
      const data = ProductsDataBuilder({})
      sut.items.push(data)
      const spyFilterMethod = jest.spyOn(sut.items, 'filter' as any)
      const result = await sut['applyFilter'](sut.items, null)
      expect(spyFilterMethod).not.toHaveBeenCalled()
      expect(result).toStrictEqual(sut.items)
    })

    //Testing the applyFilter method success cases and check if the filter is being called correctly
    it('should filter items with filter param', async () => {
      const items = [
        ProductsDataBuilder({ name: 'TEST' }),
        ProductsDataBuilder({ name: 'Test' }),
        ProductsDataBuilder({ name: 'fake' }),
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
    it('should not sort items', async () => {
      const items = [
        ProductsDataBuilder({ name: 'test', price: 10 }),
        ProductsDataBuilder({ name: 'TEST', price: 20 }),
        ProductsDataBuilder({ name: 'fake', price: 30 }),
      ]
      sut.items.push(...items)
      let result = await sut['applySort'](sut.items, null, null)
      expect(result).toStrictEqual(items)

      result = await sut['applySort'](sut.items, 'price', 'asc')
      expect(result).toStrictEqual(items)
    })

    //Testing the applySort method success case
    it('should sort items', async () => {
      const items = [
        ProductsDataBuilder({ name: 'b', price: 10 }),
        ProductsDataBuilder({ name: 'a', price: 20 }),
        ProductsDataBuilder({ name: 'c', price: 30 }),
      ]
      sut.items.push(...items)
      let result = await sut['applySort'](sut.items, 'name', 'desc')
      expect(result).toStrictEqual([items[2], items[0], items[1]])

      result = await sut['applySort'](sut.items, 'name', 'asc')
      expect(result).toStrictEqual([items[1], items[0], items[2]])
    })
  })
})
