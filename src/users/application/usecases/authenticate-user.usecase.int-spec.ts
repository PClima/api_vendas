import 'reflect-metadata'
import { UsersInMemoryRepository } from '@/users/infrastructure/in-memory/repositories/users-in-memory.repository'
import { UsersDataBuilder } from '@/users/infrastructure/testing/helpers/users-data-builder'
import { SearchUserUseCase } from './search-product.usecase'
import { AuthenticateUserUseCase } from './authenticate-user.usecase'
import { BcryptjsHashProvider } from '@/common/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { HashProvider } from '@/common/domain/providers/hash-provider'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { InvalidCredentialsError } from '@/common/domain/errors/invalid-credentials-error'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'

describe('AuthenticateUserUseCase Unit Tests', () => {
  let sut: AuthenticateUserUseCase.UseCase
  let repository: UsersInMemoryRepository
  let hashProvider: HashProvider

  beforeEach(() => {
    repository = new UsersInMemoryRepository()
    hashProvider = new BcryptjsHashProvider()
    sut = new AuthenticateUserUseCase.UseCase(repository, hashProvider)
  })

  it('should throw a error if input not provided', async () => {
    const props = { email: null, password: null }
    await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })

  it('should not find user by Email ', async () => {
    const props = UsersDataBuilder({})
    await expect(sut.execute(props)).rejects.toBeInstanceOf(NotFoundError)
  })

  it('Should not authenticate user with wrong password', async () => {
    const props = UsersDataBuilder({ password: 'password' })
    const hashedPassword = await hashProvider.generateHash(props.password)
    const user = await repository.create(props)
    user.password = hashedPassword
    await repository.insert(user)

    expect(
      sut.execute({ email: props.email, password: 'wrong_password' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('Should authenticate user', async () => {
    const props = UsersDataBuilder({ password: 'password' })
    const hashedPassword = await hashProvider.generateHash(props.password)
    const user = await repository.create(props)
    user.password = hashedPassword
    await repository.insert(user)

    const result = await sut.execute({
      email: props.email,
      password: 'password',
    })

    expect(result.email).toStrictEqual(user.email)
    expect(result.id).toStrictEqual(user.id)
  })
})
