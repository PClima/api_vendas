import { UserTokensModel } from '@/users/domain/models/user-token.model'
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

//Decoration to declare that this class is an entity of the database and the name of the table
@Entity('user_tokens')
export class UserTokens implements UserTokensModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  @Generated('uuid')
  token: string

  @Column()
  user_id: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  udpated_at: Date
}
