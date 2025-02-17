import { ProductsRepository } from '@/products/domain/repositories/products.repository'
import { inject, injectable } from 'tsyringe'
import { ProductOutput } from '../dtos/product-output.dto'

//Creating namescape for the use case better use
export namespace UpdateProductUseCase {
  //Setting the input values for the use case
  export type Input = {
    id: string
    name?: string
    price?: number
    quantity?: number
  }

  //Setting the output values for the use case
  export type Output = ProductOutput

  @injectable()
  export class UseCase {
    //Dependency injection
    constructor(
      @inject('ProductRepository')
      private productsRepository: ProductsRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      //Creating the product instance
      const product = await this.productsRepository.findById(input.id)

      if (input.name) {
        if (product.name !== input.name) {
          await this.productsRepository.conflictingName(input.name)
        }
        product.name = input.name
      }

      if (input.price) {
        product.price = input.price
      }

      if (input.quantity) {
        product.quantity = input.quantity
      }

      //Saving the product in the database
      const updatedProduct: ProductOutput =
        await this.productsRepository.update(product)

      //Returning the product created with the output values
      return updatedProduct
    }
  }
}
