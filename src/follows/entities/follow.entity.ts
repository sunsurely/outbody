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
} from 'typeorm';

@Entity({ schema: 'outbody', name: 'follows' })
export class Follow {
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

  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn({ name: 'followingUserId' })
  follower: User;

  @ManyToOne(() => User, (user) => user.followeds)
  @JoinColumn({ name: 'followedUserId' })
  followed: User;
}
