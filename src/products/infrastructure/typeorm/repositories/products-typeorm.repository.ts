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
import { Repository } from 'typeorm'
import { Product } from '../entities/products.entitiy'
import { dataSource } from '@/common/infrastructure/typeorm'
import { NotFoundError } from '@/common/domain/errors/not-found-error'

export class ProductsTypeormRepository implements ProductsRepository {
  //Setting the fields that can be sorted
  sortableFields: string[] = ['name', 'created_at']
  //Setting repository from typeorm and the Product as the entity
  productsRepository: Repository<Product>

  constructor() {
    //Creating the repository
    this.productsRepository = dataSource.getRepository(Product)
  }

  findByName(name: string): Promise<ProductModel> {
    throw new Error('Method not implemented.')
  }

  findAllByIds(productIds: ProductId[]): Promise<ProductModel[]> {
    throw new Error('Method not implemented.')
  }

  conflictingName(name: string): Promise<void> {
    throw new Error('Method not implemented.')
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

  update(model: ProductModel): Promise<ProductModel> {
    throw new Error('Method not implemented.')
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  search(props: SearchInput): Promise<SearchOutput<ProductModel>> {
    throw new Error('Method not implemented.')
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
