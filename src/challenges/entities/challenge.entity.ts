import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { Goal } from './goal.entity';
import { Challenger } from './challenger.entity';
import { User } from 'src/users/entities/user.entity';
import { Post } from 'src/posts/entities/post.entity';

@Entity()
export class Challenge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  userId: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  title: string;

  @Column({
    type: 'date',
    nullable: false,
  })
  startDate: Date;

  @Column({
    type: 'int',
    nullable: false,
  })
  challengeWeek: number;

  @Column({
    type: 'date',
    nullable: false,
  })
  endDate: Date;

  @Column({
    type: 'int',
    nullable: false,
  })
  userNumberLimit: number;

  @Column()
  publicView: boolean;

  @Column({
    type: 'text',
    nullable: false,
  })
  description: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  entryPoint: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  isDistributed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  // Challenge => Goal 1:1
  @OneToOne(() => Goal, (goal) => goal.challenge)
  goal: Goal;

  // Challenge => Challenger 1:N
  @OneToMany(() => Challenger, (challenger) => challenger.challenge)
  challenger: Challenger[];

  // User => Challenge N:1
  @ManyToOne(() => User, (user) => user.challenges)
  user: User;

  // Challenge => Post 1:N
  @OneToMany(() => Post, (post) => post.challenges, {
    cascade: true,
  })
  post: Post[];

  // 가상의 열 (조회 시에만 사용)
  @RelationId((challenge: Challenge) => challenge.challenger)
  userNumber: number;
}
