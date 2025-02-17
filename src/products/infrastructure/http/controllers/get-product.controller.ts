import { Request, Response } from 'express'
import { z } from 'zod'
import { container } from 'tsyringe'
import { GetProductUseCase } from '@/products/application/usecases/get-product.usecase'
import { dataValidation } from '@/common/infrastructure/validation/zod'

export async function getProductController(
  request: Request,
  response: Response,
) {
  //Creating the object schema to validate the request body fields
  const getProductParamSchema = z.object({
    id: z.string().uuid(),
  })

  //If the request body is valid, get the data from the validated request
  const { id } = dataValidation(getProductParamSchema, request.params)

  //Instance the use case
  const getProductUseCase: GetProductUseCase.UseCase =
    container.resolve('GetProductUseCase')

  //Executing the use case
  const product = await getProductUseCase.execute({ id })

  //Returing the created product
  return response.status(200).json(product)
}
