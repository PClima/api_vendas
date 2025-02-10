import { randomUUID } from 'crypto'
import { InMemoryRepository } from './in-memory.repository'
import { NotFoundError } from '../errors/not-found-error'

// Define the model properties
type StubModelProps = {
  id: string
  name: string
  price: number
  created_at: Date
  updated_at: Date
}

// Create a stub class that extends the InMemoryRepository
class StubInMemoryRepository extends InMemoryRepository<StubModelProps> {
  constructor() {
    super()
    this.sortableFilters = ['name']
  }

  protected async applyFilter(
    items: StubModelProps[],
    filter: string | null,
  ): Promise<StubModelProps[]> {
    if (!filter) return items
    return items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase()),
    )
  }
}

describe('InMemoryRepository unit Tests', () => {
  let sut: StubInMemoryRepository
  let model: StubModelProps
  let props: any
  let created_at: Date
  let updated_at: Date

  //Before each test we need to create a new instance of the repository
  beforeEach(() => {
    sut = new StubInMemoryRepository()
    created_at = new Date()
    updated_at = new Date()
    props = {
      name: 'test Name',
      price: 10,
    }
    model = {
      id: randomUUID(),
      created_at,
      updated_at,
      ...props,
    }
  })

  describe('create', () => {
    //Testing the create method
    it('should create a new model', async () => {
      const result = await sut.create(props)
      expect(result.name).toStrictEqual('test Name')
    })
  })

  describe('insert', () => {
    //Testing the insert method
    it('should inserts a new model', async () => {
      const result = await sut.insert(model)
      expect(result).toStrictEqual(sut.items[0])
    })
  })

  describe('findById', () => {
    //Testing the findById method error case
    it('should throw error when id not found in findById', async () => {
      await expect(sut.findById('invalid_id')).rejects.toThrow(
        new NotFoundError(`Model not found using ID: invalid_id`),
      )
    })

    //Testing the findById method success case
    it('should find a model by id', async () => {
      const data = await sut.insert(model)
      const result = await sut.findById(data.id)
      expect(result).toStrictEqual(data)
    })
  })

  describe('update', () => {
    //Testing the update method error case
    it('should throw error when id not found in update', async () => {
      await expect(sut.update(model)).rejects.toThrow(
        new NotFoundError(`Model not found using ID: ${model.id}`),
      )
    })

    //Testing the update method success case
    it('should update a model by id', async () => {
      const data = await sut.insert(model)
      const modelUpdated = {
        id: data.id,
        name: 'updated Name',
        price: 2000,
        created_at,
        updated_at,
      }
      const result = await sut.update(modelUpdated)
      expect(result).toStrictEqual(sut.items[0])
    })
  })

  describe('delete', () => {
    //Testing the delete method error case
    it('should throw error when id not found in delete', async () => {
      await expect(sut.delete('invalid_id')).rejects.toThrow(
        new NotFoundError(`Model not found using ID: invalid_id`),
      )
    })

    //Testing the delete method success case
    it('should delete a model', async () => {
      const data = await sut.insert(model)
      expect(sut.items.length).toBe(1)
      await sut.delete(data.id)
      expect(sut.items.length).toBe(0)
    })
  })

  describe('applyFilter', () => {
    //Testing the applyFilter method error case and check if the filter is not being called
    it('should no filter items when filter parameter is null', async () => {
      const items = [model]
      const spyFilterMethod = jest.spyOn(items, 'filter' as any)
      const result = await sut['applyFilter'](items, null)
      expect(spyFilterMethod).not.toHaveBeenCalled()
      expect(result).toStrictEqual(items)
    })

    //Testing the applyFilter method success cases and check if the filter is being called correctly
    it('should filter items with filter param', async () => {
      const items = [
        { id: randomUUID(), name: 'test', price: 10, created_at, updated_at },
        { id: randomUUID(), name: 'TEST', price: 20, created_at, updated_at },
        { id: randomUUID(), name: 'fake', price: 30, created_at, updated_at },
      ]
      const spyFilterMethod = jest.spyOn(items, 'filter' as any)
      let result = await sut['applyFilter'](items, 'TEST')
      expect(spyFilterMethod).toHaveBeenCalledTimes(1)
      expect(result).toStrictEqual([items[0], items[1]])

      result = await sut['applyFilter'](items, 'test')
      expect(spyFilterMethod).toHaveBeenCalledTimes(2)
      expect(result).toStrictEqual([items[0], items[1]])

      result = await sut['applyFilter'](items, 'fake')
      expect(spyFilterMethod).toHaveBeenCalledTimes(3)
      expect(result).toStrictEqual([items[2]])

      result = await sut['applyFilter'](items, 'no-filter')
      expect(spyFilterMethod).toHaveBeenCalledTimes(4)
      expect(result).toHaveLength(0)
    })
  })

  describe('applySort', () => {
    //Testing the applySort method error case when sort is null or sortableFilters does not include the sort
    it('should not sort items', async () => {
      const items = [
        { id: randomUUID(), name: 'test', price: 10, created_at, updated_at },
        { id: randomUUID(), name: 'TEST', price: 20, created_at, updated_at },
        { id: randomUUID(), name: 'fake', price: 30, created_at, updated_at },
      ]
      let result = await sut['applySort'](items, null, null)
      expect(result).toStrictEqual(items)

      result = await sut['applySort'](items, 'price', 'asc')
      expect(result).toStrictEqual(items)
    })

    //Testing the applySort method success case
    it('should sort items', async () => {
      const items = [
        { id: randomUUID(), name: 'b', price: 10, created_at, updated_at },
        { id: randomUUID(), name: 'a', price: 20, created_at, updated_at },
        { id: randomUUID(), name: 'c', price: 30, created_at, updated_at },
      ]
      let result = await sut['applySort'](items, 'name', 'desc')
      expect(result).toStrictEqual([items[2], items[0], items[1]])

      result = await sut['applySort'](items, 'name', 'asc')
      expect(result).toStrictEqual([items[1], items[0], items[2]])
    })
  })

  describe('applyPagginate', () => {
    //Testing the applySort method success case
    it('should paginate items', async () => {
      const items = [
        { id: randomUUID(), name: 'a', price: 10, created_at, updated_at },
        { id: randomUUID(), name: 'b', price: 20, created_at, updated_at },
        { id: randomUUID(), name: 'c', price: 30, created_at, updated_at },
        { id: randomUUID(), name: 'd', price: 20, created_at, updated_at },
        { id: randomUUID(), name: 'e', price: 30, created_at, updated_at },
      ]
      let result = await sut['applyPaginate'](items, 1, 2)
      expect(result).toStrictEqual([items[0], items[1]])

      result = await sut['applyPaginate'](items, 2, 2)
      expect(result).toStrictEqual([items[2], items[3]])

      result = await sut['applyPaginate'](items, 3, 2)
      expect(result).toStrictEqual([items[4]])

      result = await sut['applyPaginate'](items, 4, 2)
      expect(result).toHaveLength(0)
    })
  })

  describe('search', () => {
    //Testing the applySort method success case without any parameter
    it('should paginate items', async () => {
      const items = Array(16).fill({
        ...model,
        name: Math.random().toString(36).substring(7),
      })
      sut.items = items
      const result = await sut.search({})
      expect(result).toStrictEqual({
        items: items.slice(0, 15),
        total: 16,
        current_page: 1,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      })
    })

    //Testing the applySort method success case with only filter parameter
    it('should apply paginate and filter items', async () => {
      const items = [
        { id: randomUUID(), name: 'test', price: 10, created_at, updated_at },
        { id: randomUUID(), name: 'a', price: 20, created_at, updated_at },
        { id: randomUUID(), name: 'TEST', price: 30, created_at, updated_at },
        { id: randomUUID(), name: 'TeSt', price: 20, created_at, updated_at },
      ]
      sut.items = items
      const result = await sut.search({
        page: 1,
        per_page: 2,
        filter: 'test',
      })
      expect(result).toStrictEqual({
        items: [items[0], items[2]],
        total: 3,
        current_page: 1,
        per_page: 2,
        sort: null,
        sort_dir: null,
        filter: 'test',
      })
    })

    //Testing the applySort method success case with only sort parameter
    it('should apply paginate and sort items', async () => {
      const items = [
        { id: randomUUID(), name: 'b', price: 10, created_at, updated_at },
        { id: randomUUID(), name: 'a', price: 20, created_at, updated_at },
        { id: randomUUID(), name: 'c', price: 30, created_at, updated_at },
        { id: randomUUID(), name: 'e', price: 20, created_at, updated_at },
        { id: randomUUID(), name: 'd', price: 20, created_at, updated_at },
      ]
      sut.items = items
      let result = await sut.search({
        page: 1,
        per_page: 2,
        sort: 'name',
        sort_dir: 'asc',
      })
      expect(result).toStrictEqual({
        items: [items[1], items[0]],
        total: 5,
        current_page: 1,
        per_page: 2,
        sort: 'name',
        sort_dir: 'asc',
        filter: null,
      })

      result = await sut.search({
        page: 2,
        per_page: 2,
        sort: 'name',
        sort_dir: 'asc',
      })
      expect(result).toStrictEqual({
        items: [items[2], items[4]],
        total: 5,
        current_page: 2,
        per_page: 2,
        sort: 'name',
        sort_dir: 'asc',
        filter: null,
      })
    })

    //Testing the applySort method success case with all parameters
    it('should apply paginate, sort and filter items', async () => {
      const items = [
        { id: randomUUID(), name: 'test', price: 10, created_at, updated_at },
        { id: randomUUID(), name: 'TEST', price: 20, created_at, updated_at },
        { id: randomUUID(), name: 'other', price: 30, created_at, updated_at },
        { id: randomUUID(), name: 'Other', price: 20, created_at, updated_at },
        { id: randomUUID(), name: 'd', price: 20, created_at, updated_at },
      ]
      sut.items = items
      let result = await sut.search({
        page: 1,
        per_page: 2,
        sort: 'price',
        sort_dir: 'asc',
        filter: 'test',
      })
      expect(result).toStrictEqual({
        items: [items[0], items[1]],
        total: 2,
        current_page: 1,
        per_page: 2,
        sort: 'price',
        sort_dir: 'asc',
        filter: 'test',
      })

      result = await sut.search({
        page: 2,
        per_page: 2,
        sort: 'price',
        sort_dir: 'asc',
        filter: 'test',
      })
      expect(result).toStrictEqual({
        items: [],
        total: 2,
        current_page: 2,
        per_page: 2,
        sort: 'price',
        sort_dir: 'asc',
        filter: 'test',
      })
    })
  })
})
