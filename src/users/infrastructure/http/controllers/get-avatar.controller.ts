import { instanceToInstance } from 'class-transformer'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { GetAvatarUseCase } from '@/users/application/usecases/get-avatar.usecase'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function getAvatarController(
  request: Request,
  response: Response,
): Promise<Response> {
  //Get user_id from request body
  const bodySchema = z.object({
    filename: z.string(),
  })
  const { filename } = dataValidation(bodySchema, request.body)

  const getAvatarUseCase: GetAvatarUseCase.UseCase =
    container.resolve('GetAvatarUseCase')

  const avatar_url = await getAvatarUseCase.execute({
    filename,
  })

  return response.status(200).json(avatar_url)
}
