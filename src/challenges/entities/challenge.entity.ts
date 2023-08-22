import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Goal } from './goal.entity';
import { Challenger } from './challenger.entity';
import { User } from 'src/users/entities/user.entity';

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
    type: 'text',
    nullable: false,
  })
  imgUrl: string;

  @Column({
    type: 'date',
    nullable: false,
  })
  startDate: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  challengeWeek: number;

  @Column({
    type: 'date',
    nullable: false,
  })
  endDate: string;

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
  totalPoint: number;

  @CreateDateColumn()
  createdAt: Date;

  // Challenge => Goal 1:1
  @OneToOne(() => Goal, (goal) => goal.challenge)
  goal: Goal;

  // Challenge => Challenger 1:N
  @OneToMany(() => Challenger, (challenger) => challenger.challenge)
  challenger: Challenger[];

  // User => Challenge N:1
  @ManyToOne(() => User, (user) => user.challenge)
  @JoinColumn({ name: 'userId' })
  user: User;
}
