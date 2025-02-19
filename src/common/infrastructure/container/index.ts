import { container } from 'tsyringe'
import '@/products/infrastructure/container'
import '@/users/infrastructure/container'
import { BcryptjsHashProvider } from '@/common/infrastructure/providers/hash-provider/bcryptjs-hash.provider'

container.registerSingleton('HashProvider', BcryptjsHashProvider)
