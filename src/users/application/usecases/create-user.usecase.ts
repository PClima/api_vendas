import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { UsersRepository } from '@/users/domain/repositories/users.repository'
import { inject, injectable } from 'tsyringe'
import { UserOutput } from '../dtos/user-output.dto'
import { HashProvider } from '@/common/domain/providers/hash-provider'

//Creating namescape for the use case better use
export namespace CreateUserUseCase {
  //Setting the input values for the use case
  export type Input = {
    name: string
    email: string
    password: string
  }

  //Setting the output values for the use case
  export type Output = UserOutput

  @injectable()
  export class UseCase {
    //Dependency injection
    constructor(
      @inject('UsersRepository')
      private usersRepository: UsersRepository,
      @inject('HashProvider')
      private hashProvider: HashProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      //Validating input data before creating the user
      if (!input.name || !input.email || !input.password) {
        throw new BadRequestError('Input data not provided or invalid.')
      }

      //Validating if the user email already exists
      await this.usersRepository.conflictingEmail(input.email)

      const hashedPassword = await this.hashProvider.generateHash(
        input.password,
      )

      //Creating the user instance
      const user: UserOutput = this.usersRepository.create(input)
      user.password = hashedPassword

      //Saving the user in the database
      const createdUser: UserOutput = await this.usersRepository.insert(user)

      //Returning the user created with the output values
      return createdUser
    }
  }
}
