import { BcryptjsHashProvider } from './bcryptjs-hash.provider'

describe('BcryptjsHashProvider unit tests', () => {
  let sut: BcryptjsHashProvider

  beforeEach(() => {
    sut = new BcryptjsHashProvider()
  })

  it('Should return encrypted password', async () => {
    const password = 'any_password'
    const encryptedPassword = await sut.generateHash(password)

    expect(encryptedPassword).toBeDefined()
  })

  it('Should return false on invalid password and hash comparison', async () => {
    const password = 'any_password'
    const encryptedPassword = await sut.generateHash(password)
    const isValid = await sut.compareHash('invalid_password', encryptedPassword)

    expect(isValid).toBe(false)
  })

  it('Should return true on valid password and hash comparison', async () => {
    const password = 'any_password'
    const encryptedPassword = await sut.generateHash(password)
    const isValid = await sut.compareHash('any_password', encryptedPassword)

    expect(isValid).toBe(true)
  })
})
