import { ConflictError } from '@/common/domain/errors/conflict-error'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { InMemoryRepository } from '@/common/domain/repositories/in-memory.repository'
import { UserModel } from '@/users/domain/models/users.model'
import { UsersRepository } from '@/users/domain/repositories/users.repository'

export class UsersInMemoryRepository
  extends InMemoryRepository<UserModel>
  implements UsersRepository
{
  sortableFilters: string[] = ['name', 'email', 'created_at']

  async findByEmail(email: string): Promise<UserModel> {
    const user = this.items.find(item => item.email === email)

    if (!user) {
      throw new NotFoundError(`User not found using email ${email}`)
    }
    return user
  }

  async findByName(name: string): Promise<UserModel> {
    const user = this.items.find(item => item.name === name)

    if (!user) {
      throw new NotFoundError(`User not found using name ${name}`)
    }
    return user
  }

  async conflictingEmail(email: string): Promise<void> {
    const product = this.items.find(item => item.email === email)
    if (product) {
      throw new ConflictError(`Email already used by other user`)
    }
  }

  protected async applyFilter(
    items: UserModel[],
    filter: string | null,
  ): Promise<UserModel[]> {
    if (!filter) return items
    return items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase()),
    )
  }

  protected async applySort(
    items: UserModel[],
    sort: string | null,
    sort_dir: string | null,
  ): Promise<UserModel[]> {
    return super.applySort(items, sort ?? 'created_at', sort_dir ?? 'desc')
  }
}
