import { UserEntity } from 'src/users/entities/user.entity';
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
export class FollowEntity {
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

  @ManyToOne(() => UserEntity, (follower) => follower.followings)
  @JoinColumn({ name: 'followingUserId' })
  follower: UserEntity;

  @ManyToOne(() => UserEntity, (followedUser) => followedUser.followeds)
  @JoinColumn({ name: 'followedUserId' })
  followedUser: UserEntity;
}
