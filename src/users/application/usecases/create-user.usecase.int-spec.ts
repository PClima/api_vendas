import 'reflect-metadata'
import { CreateUserUseCase } from './create-user.usecase'
import { UsersInMemoryRepository } from '@/users/infrastructure/in-memory/repositories/users-in-memory.repository'
import { ConflictError } from '@/common/domain/errors/conflict-error'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { HashProvider } from '@/common/domain/providers/hash-provider'
import { UsersDataBuilder } from '@/users/infrastructure/testing/helpers/users-data-builder'
import { BcryptjsHashProvider } from '@/common/infrastructure/providers/hash-provider/bcryptjs-hash.provider'

describe('CreateProductUsecase Unit Tests and Hash integration Tests', () => {
  let sut: CreateUserUseCase.UseCase
  let repository: UsersInMemoryRepository
  let hashProvider: HashProvider

  beforeEach(() => {
    repository = new UsersInMemoryRepository()
    hashProvider = new BcryptjsHashProvider()
    sut = new CreateUserUseCase.UseCase(repository, hashProvider)
  })

  it('Should create a user', async () => {
    //Ensure that the product will be created
    const spyInsert = jest.spyOn(repository, 'insert')

    //Creating the product input
    const props = UsersDataBuilder({})

    const result = await sut.execute(props)
    expect(result.id).toBeDefined()
    expect(result.created_at).toBeDefined()
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })

  it('Should not be possible to register a user with the email of another user', async () => {
    const props = UsersDataBuilder({})

    //Creating the product
    await sut.execute(props)

    //Trying to create another product with the same name
    await expect(sut.execute(props)).rejects.toBeInstanceOf(ConflictError)
  })

  it('Should thorw an error when the name not provided', async () => {
    const props = {
      name: null,
      email: 'any_email',
      password: 'any_password',
    }
    //Trying to create another product with the same name
    await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })

  it('Should thorw an error when the email not provided', async () => {
    const props = {
      name: 'any_name',
      email: null,
      password: 'any_password',
    }
    //Trying to create another product with the same name
    await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })

  it('Should thorw an error when the password not provided', async () => {
    const props = {
      name: 'any_name',
      email: 'any_email',
      password: null,
    }
    //Trying to create another product with the same name
    await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })

  it('Should encypt the user password when registering', async () => {
    const props = UsersDataBuilder({ password: 'any_password' })
    const result = await sut.execute(props)

    const isValid = await hashProvider.compareHash(
      'any_password',
      result.password,
    )

    expect(isValid).toBeTruthy()
  })
})
