import {
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
@Unique(['email', 'nickname'])
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  nickname: string;

  @Column()
  password: string;

  @Column()
  desc: string;

  @Column()
  avatar: string;

  @Column()
  role: 'user' | 'author' | 'admin';

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt?: string;
}
