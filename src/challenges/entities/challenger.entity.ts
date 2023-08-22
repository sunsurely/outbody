import {
  ManyToOne,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Challenge } from './challenge.entity';
import { User } from 'src/users/entities/user.entity';
import { Position } from '../challengerInfo';

@Entity()
export class Challenger {
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

  @Column({
    type: 'enum',
    enum: Position,
  })
  type: Position;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  done: boolean;

  // Challenger => Challenge N:1
  @ManyToOne(() => Challenge, (challenge) => challenge.challenger, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'challengeId' })
  challenge: Challenge;

  // Challenger => User N:1
  @ManyToOne(() => User, (user) => user.challenger, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}
