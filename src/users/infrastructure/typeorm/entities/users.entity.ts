import { env } from '@/common/infrastructure/env'
import { UserModel } from '@/users/domain/models/users.model'
import { Exclude, Expose } from 'class-transformer'
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

//Decoration to declare that this class is an entity of the database and the name of the table
@Entity('users')
export class User implements UserModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  @Exclude() //Decoration to exclude the password field from the response
  password: string

  @Column()
  avatar?: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @Expose({ name: 'avatar_url' }) //Decoration to change the name of the field in the response
  getAvatarUrl() {
    if (!this.avatar) return null

    return `${env.BUCKET_LINK}${this.avatar}` //Return the url of the avatar
  }
}
