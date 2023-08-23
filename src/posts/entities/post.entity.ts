import { Like } from 'src/likes/entities/like.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({ schema: 'outbody', name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  challengeId: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  userId: number;

  @Column('varchar')
  description: string;

  @Column('varchar', { nullable: true })
  imgUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Like, (like) => like.post)
  like: Like[];
}
