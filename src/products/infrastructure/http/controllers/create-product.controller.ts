import { AppError } from '@/common/domain/errors/app-error'
import { Request, Response } from 'express'
import { z } from 'zod'
import { ProductsTypeormRepository } from '../../typeorm/repositories/products-typeorm.repository'
import { dataSource } from '@/common/infrastructure/typeorm'
import { Product } from '../../typeorm/entities/products.entitiy'
import { CreateProductUseCase } from '@/products/application/usecases/create-product.usecase'

export async function createProductController(
  request: Request,
  response: Response,
) {
  //Creating the object schema to validate the request body fields
  const createProductBodySchema = z.object({
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
  })

  //Execute the validation
  const validatedData = createProductBodySchema.safeParse(request.body)

  //Validating the request body and return an error if it is invalid
  if (validatedData.success === false) {
    console.error('Invalida data', validatedData.error.format())
    //Throwing an error with the error message for each invalid field
    throw new AppError(
      `${validatedData.error.errors.map(err => {
        return `${err.path} -> ${err.message}`
      })}`,
    )
  }

  //If the request body is valid, get the data from the validated request
  const { name, price, quantity } = validatedData.data

  //Creating the isntance of the repository
  const repository = new ProductsTypeormRepository()
  //Adding the repository to the data source
  repository.productsRepository = dataSource.getRepository(Product)
  //Instance the use case
  const createProductUseCase = new CreateProductUseCase.UseCase(repository)

  //Executing the use case
  const product = await createProductUseCase.execute({ name, price, quantity })

  //Returing the created product
  return response.status(201).json(product)
}
