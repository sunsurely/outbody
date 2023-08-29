import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Challenge } from './challenge.entity';

@Entity()
export class Goal {
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
  attend: number;

  @Column({
    type: 'int',
    default: 0,
  })
  weight: number;

  @Column({
    type: 'int',
    default: 0,
  })
  muscle: number;

  @Column({
    type: 'int',
    default: 0,
  })
  fat: number;

  // Goal => Challenge 1:1
  @OneToOne(() => Challenge, (challenge) => challenge.goal, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'challengeId' })
  challenge: Challenge;
}
