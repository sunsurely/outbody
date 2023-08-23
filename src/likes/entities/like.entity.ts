import { User } from 'src/users/entities/user.entity';
import { Post } from 'src/posts/entities/post.entity';
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

@Entity({ schema: 'outbody', name: 'likes' })
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  postId: number;

  @Column('int')
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.like)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Post, (post) => post.like)
  @JoinColumn({ name: 'postId' })
  post: Post;
}