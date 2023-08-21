import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';

@Entity({ schema: 'outbody', name: 'follows' })
export class Follow extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'followId' })
  id: number;

  @Column('int')
  followingUserId: number;

  @Column('int')
  followedUserId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'followingUserId' })
  follower: User;

  @ManyToOne(() => User, (user) => user.followeds, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'followedUserId' })
  followed: User;
}
