import { AuthProvider } from './../../../../common/domain/providers/auth-provider'
import { Request, Response } from 'express'
import { z } from 'zod'
import { AuthenticateUserUseCase } from '@/users/application/usecases/authenticate-user.usecase'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'

export async function authenticateUserController(
  request: Request,
  response: Response,
) {
  //Creating the object schema to validate the request body fields
  const authenticateUserBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  //If the request body is valid, get the data from the validated request
  const { email, password } = dataValidation(
    authenticateUserBodySchema,
    request.body,
  )

  //Instance the use case
  const authenticateUserUseCase: AuthenticateUserUseCase.UseCase =
    container.resolve('AuthenticateUserUseCase')

  //Executing the use case
  const user = await authenticateUserUseCase.execute({ email, password })

  const authProvider: AuthProvider = container.resolve('AuthProvider')

  const { access_token } = authProvider.generateAuthKey(user.id)

  //Returing the created user
  return response.status(200).json({ access_token })
}
