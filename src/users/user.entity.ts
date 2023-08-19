import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Gender, Provider } from './userInfo';

@Entity({ schema: 'outbody', name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'userId' })
  userId: number;

  @Column('varchar', { length: 30 })
  name: string;

  @Column('int', { nullable: true })
  age: number;

  @Column('int', { nullable: true })
  height: number;

  @Column('varchar', { length: 60 })
  email: string;

  @Column('varchar', { length: 100, nullable: true })
  password: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ type: 'enum', enum: Provider, default: Provider.LOCAL })
  provider: Provider;

  @Column('varchar', { nullable: true })
  imgUrl: string;

  @Column('int', { nullable: true })
  point: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'followedId' })
  followedUser: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'followingId' })
  followingUser: UserEntity;
}
