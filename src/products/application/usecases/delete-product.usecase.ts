import { ProductsRepository } from '@/products/domain/repositories/products.repository'
import { inject, injectable } from 'tsyringe'

//Creating namescape for the use case better use
export namespace DeleteProductUseCase {
  //Setting the input values for the use case
  export type Input = {
    id: string
  }

  export type Output = void

  @injectable()
  export class UseCase {
    //Dependency injection
    constructor(
      @inject('ProductRepository')
      private productsRepository: ProductsRepository,
    ) {}

    async execute(input: Input): Promise<void> {
      //Creating the product instance
      await this.productsRepository.delete(input.id)
    }
  }
}
