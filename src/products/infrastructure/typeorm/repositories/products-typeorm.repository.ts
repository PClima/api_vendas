import {
  SearchInput,
  SearchOutput,
} from '@/common/domain/repositories/repository.interface'
import { ProductModel } from '@/products/domain/models/products.model'
import {
  CreateProductProps,
  ProductId,
  ProductsRepository,
} from '@/products/domain/repositories/products.repository'
import { ILike, In, Repository } from 'typeorm'
import { Product } from '../entities/products.entitiy'
import { dataSource } from '@/common/infrastructure/typeorm'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { ConflictError } from '@/common/domain/errors/conflict-error'
import { totalmem } from 'os'

export class ProductsTypeormRepository implements ProductsRepository {
  //Setting the fields that can be sorted
  sortableFields: string[] = ['name', 'created_at']
  //Setting repository from typeorm and the Product as the entity
  productsRepository: Repository<Product>

  constructor() {
    //Creating the repository
    this.productsRepository = dataSource.getRepository(Product)
  }

  async findByName(name: string): Promise<ProductModel> {
    const product = await this.productsRepository.findOneBy({ name })
    if (!product) {
      throw new NotFoundError(`Product not found unsing name ${name}`)
    }
    return product
  }

  async findAllByIds(productIds: ProductId[]): Promise<ProductModel[]> {
    const ids = productIds.map(productId => productId.id)
    const productsFound = await this.productsRepository.find({
      where: { id: In(ids) },
    })

    return productsFound
  }

  async conflictingName(name: string): Promise<void> {
    const products = await this.productsRepository.findOneBy({ name })
    if (products) {
      throw new ConflictError(`Name '${name}' already used on another product`)
    }
  }

  //Creating a new instance of the ProductModel
  create(props: CreateProductProps): ProductModel {
    return this.productsRepository.create(props)
  }

  //Inserting the instance of the ProductModel into the database
  async insert(model: ProductModel): Promise<ProductModel> {
    return this.productsRepository.save(model)
  }

  async findById(id: string): Promise<ProductModel> {
    return this._get(id)
  }

  async update(model: ProductModel): Promise<ProductModel> {
    await this._get(model.id)
    await this.productsRepository.update({ id: model.id }, model)
    return model
  }

  async delete(id: string): Promise<void> {
    await this._get(id)
    await this.productsRepository.delete({ id })
  }

  async search(props: SearchInput): Promise<SearchOutput<ProductModel>> {
    //Validating the sort and sort_dir fields are correct
    const validSort = this.sortableFields.includes(props.sort) || false
    const dirOps = ['asc', 'desc']
    const validSortDir =
      (props.sort_dir && dirOps.includes(props.sort_dir.toLowerCase())) || false

    //Setting the orderByField and orderByDir based on the validation, if no set default values
    const orderByField = validSort ? props.sort : 'created_at'
    const orderByDir = validSortDir ? props.sort_dir : 'desc'

    const [products, total] = await this.productsRepository.findAndCount({
      ...(props.filter && { where: { name: ILike(props.filter) } }),
      order: { [orderByField]: orderByDir },
      take: props.per_page,
      skip: (props.page - 1) * props.per_page,
    })

    return {
      items: products,
      per_page: props.per_page,
      total,
      current_page: props.page,
      sort: orderByField,
      sort_dir: orderByDir,
      filter: props.filter,
    }
  }

  //Creating a _get to reuse the search method
  protected async _get(id: string): Promise<ProductModel> {
    const product = await this.productsRepository.findOneBy({ id })
    if (!product) {
      throw new NotFoundError(`Product not found unsing id ${id}`)
    }
    return product
  }
}
