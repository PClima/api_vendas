import { inject, injectable } from 'tsyringe'
import { UserOutput } from '../dtos/user-output.dto'
import { UsersRepository } from '@/users/domain/repositories/users.repository'
import { HashProvider } from '@/common/domain/providers/hash-provider'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { InvalidCredentialsError } from '@/common/domain/errors/invalid-credentials-error'
import { NotFoundError } from '@/common/domain/errors/not-found-error'

export namespace AuthenticateUserUseCase {
  export type Input = {
    email: string
    password: string
  }

  export type Output = UserOutput

  @injectable()
  export class UseCase {
    constructor(
      @inject('UsersRepository')
      private usersRepository: UsersRepository,
      @inject('HashProvider')
      private hashProvider: HashProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      //Validating input data before creating the user
      if (!input.email || !input.password) {
        throw new BadRequestError('Input data not provided or invalid.')
      }

      const user = await this.usersRepository.findByEmail(input.email)

      const passwordMatch = await this.hashProvider.compareHash(
        input.password,
        user.password,
      )

      if (!passwordMatch) {
        throw new InvalidCredentialsError('Invalid credentials.')
      }

      return user
    }
  }
}
