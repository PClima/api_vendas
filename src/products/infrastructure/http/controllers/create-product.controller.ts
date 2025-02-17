import { Request, Response } from 'express'
import { z } from 'zod'
import { CreateProductUseCase } from '@/products/application/usecases/create-product.usecase'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'

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

  //If the request body is valid, get the data from the validated request
  const { name, price, quantity } = dataValidation(
    createProductBodySchema,
    request.body,
  )

  //Instance the use case
  const createProductUseCase: CreateProductUseCase.UseCase = container.resolve(
    'CreateProductUseCase',
  )

  //Executing the use case
  const product = await createProductUseCase.execute({ name, price, quantity })

  //Returing the created product
  return response.status(201).json(product)
}
