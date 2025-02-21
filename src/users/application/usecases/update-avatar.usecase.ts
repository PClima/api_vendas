import { inject, injectable } from 'tsyringe'
import { UserOutput } from '../dtos/user-output.dto'
import { UsersRepository } from '@/users/domain/repositories/users.repository'
import { UploaderProvider } from '@/common/domain/providers/uploader-provider'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { randomUUID } from 'crypto'

export namespace UpdateAvatarUseCase {
  export type Input = {
    user_id: string
    filename: string
    filesize: number
    filetype: string
    body: Buffer
  }

  export type Output = UserOutput

  export const MAX_UPLOAD_SIZE = 1024 * 1024 * 3 // 3MB

  export const ACCEPTED_FILE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ]

  @injectable()
  export class UseCase {
    constructor(
      @inject('UsersRepository')
      private usersRepository: UsersRepository,
      @inject('UploaderProvider')
      private uploader: UploaderProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { user_id, filename, filesize, filetype, body } = input

      //Validating if the file is an image and extension is accepted
      if (!ACCEPTED_FILE_TYPES.includes(filetype)) {
        throw new BadRequestError(
          'Invalid file type, only .jpeg, .jpg, .png and .webp are accepted',
        )
      }

      //Validating if the file size is less than 3MB
      if (filesize > MAX_UPLOAD_SIZE) {
        throw new BadRequestError('File size must be less than 3MB')
      }

      const user = await this.usersRepository.findById(user_id)

      const uniqueFileName = `${randomUUID()}-${filename}`

      await this.uploader.upload({
        filename: uniqueFileName,
        filetype,
        body,
      })

      user.avatar = uniqueFileName

      return this.usersRepository.update(user)
    }
  }
}
