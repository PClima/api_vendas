import { inject, injectable } from 'tsyringe'
import { UserOutput } from '../dtos/user-output.dto'
import { UsersRepository } from '@/users/domain/repositories/users.repository'
import { UploaderProvider } from '@/common/domain/providers/uploader-provider'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { randomUUID } from 'crypto'

export namespace GetAvatarUseCase {
  export type Input = {
    filename: string
  }

  export type Output = {
    avatar_url: string
  }

  @injectable()
  export class UseCase {
    constructor(
      @inject('UploaderProvider')
      private uploader: UploaderProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { filename } = input

      const avatar_url = await this.uploader.generatePresignedURL(filename)

      return { avatar_url }
    }
  }
}
