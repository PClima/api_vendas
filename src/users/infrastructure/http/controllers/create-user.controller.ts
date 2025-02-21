import { Request, Response } from 'express'
import { z } from 'zod'
import { CreateUserUseCase } from '@/users/application/usecases/create-user.usecase'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { instanceToInstance } from 'class-transformer'

export async function createUserController(
  request: Request,
  response: Response,
) {
  //Creating the object schema to validate the request body fields
  const createUserBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  })

  //If the request body is valid, get the data from the validated request
  const { name, email, password } = dataValidation(
    createUserBodySchema,
    request.body,
  )

  //Instance the use case
  const createUserUseCase: CreateUserUseCase.UseCase =
    container.resolve('CreateUserUseCase')

  //Executing the use case
  const user = await createUserUseCase.execute({ name, email, password })

  //Returing the created user
  return response.status(201).json(instanceToInstance(user))
}
