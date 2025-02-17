import { ProductsRepository } from '@/products/domain/repositories/products.repository'
import { inject, injectable } from 'tsyringe'
import { ProductOutput } from '../dtos/product-output.dto'

//Creating namescape for the use case better use
export namespace GetProductUseCase {
  //Setting the input values for the use case
  export type Input = {
    id: string
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
      const product: ProductOutput = await this.productsRepository.findById(
        input.id,
      )

      //Returning the product created with the output values
      return product
    }
  }
}
