import { Request, Response } from 'express'
import { z } from 'zod'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { UpdateProductUseCase } from '@/products/application/usecases/update-product.usecase'

export async function updateProductController(
  request: Request,
  response: Response,
) {
  //Creating the object schema to validate the request body fields
  const updateProductBodySchema = z.object({
    name: z.optional(z.string()),
    price: z.optional(z.number()),
    quantity: z.optional(z.number()),
  })

  //If the request body is valid, get the data from the validated request
  const { name, price, quantity } = dataValidation(
    updateProductBodySchema,
    request.body,
  )

  //Creating the object schema to validate the request body fields
  const updateProductParamSchema = z.object({
    id: z.string().uuid(),
  })

  //If the request body is valid, get the data from the validated request
  const { id } = dataValidation(updateProductParamSchema, request.params)

  //Instance the use case
  const updateProductUseCase: UpdateProductUseCase.UseCase = container.resolve(
    'UpdateProductUseCase',
  )

  //Executing the use case
  const product = await updateProductUseCase.execute({
    id,
    name,
    price,
    quantity,
  })

  //Returing the created product
  return response.status(200).json(product)
}
