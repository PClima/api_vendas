import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { ProductsRepository } from '@/products/domain/repositories/products.repository'

//Creating namescape for the use case better use
export namespace CreateProductUseCase {
  //Setting the input values for the use case
  export type Input = {
    name: string
    price: number
    quantity: number
  }

  //Setting the output values for the use case
  export type Output = {
    id: string
    name: string
    price: number
    quantity: number
    created_at: Date
    updated_at: Date
  }

  export class UseCase {
    //Dependency injection
    constructor(private productsRepository: ProductsRepository) {}

    async execute(input: Input): Promise<Output> {
      //Validating input data before creating the product
      if (!input.name || input.price <= 0 || input.quantity <= 0) {
        throw new BadRequestError('Input data not provided or invalid.')
      }

      //Validating if the product name already exists
      await this.productsRepository.conflictingName(input.name)

      //Creating the product instance
      const product = this.productsRepository.create(input)

      //Saving the product in the database
      await this.productsRepository.insert(product)

      //Returning the product created with the output values
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        created_at: product.created_at,
        updated_at: product.updated_at,
      }
    }
  }
}
