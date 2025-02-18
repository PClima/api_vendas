import { Request, Response } from 'express'
import { z } from 'zod'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { UpdateProductUseCase } from '@/products/application/usecases/update-product.usecase'
import { DeleteProductUseCase } from '@/products/application/usecases/delete-product.usecase'

export async function deleteProductController(
  request: Request,
  response: Response,
) {
  //Creating the object schema to validate the request body fields
  const deleteProductParamSchema = z.object({
    id: z.string().uuid(),
  })

  //If the request body is valid, get the data from the validated request
  const { id } = dataValidation(deleteProductParamSchema, request.params)

  //Instance the use case
  const deleteProductUseCase: DeleteProductUseCase.UseCase = container.resolve(
    'DeleteProductUseCase',
  )

  //Executing the use case
  await deleteProductUseCase.execute({
    id,
  })

  //Returing the created product
  return response.status(204).send()
}
