import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Gender, Provider } from '../userInfo';
import { Record } from 'src/records/entities/records.entity';
import { Follow } from '../../follows/entities/follow.entity';
import { Report } from '../../reports/entities/report.entity';
import { Challenger } from 'src/challenges/entities/challenger.entity';
import { Challenge } from 'src/challenges/entities/challenge.entity';

@Entity({ schema: 'outbody', name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'userId' })
  id: number;

  @Column('varchar', { length: 30 })
  name: string;

  @Column('int')
  age: number;

  @Column('int')
  height: number;

  @Column('varchar')
  email: string;

  @Column('varchar', { length: 100 })
  password: string;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ type: 'enum', enum: Provider, default: Provider.LOCAL })
  provider: Provider;

  @Column('varchar', { nullable: true })
  imgUrl: string;

  @Column('varchar', { nullable: true })
  comment: string;

  @Column({ type: 'int', default: 0 })
  point: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => Record, (record) => record.user, { cascade: true })
  records: Record[];

  @OneToMany(() => Follow, (follow) => follow.follower, { cascade: true })
  followers: Follow[];

  @OneToMany(() => Follow, (follow) => follow.followed, { cascade: true })
  followeds: Follow[];

  @OneToMany(() => Report, (reporting) => reporting.reporter)
  @JoinColumn({ name: 'reporterId' })
  reportings: Report[];

  @OneToMany(() => Report, (reported) => reported.reportedUser)
  @JoinColumn({ name: 'reportedUserId' })
  reporteds: Report[];

  @OneToMany(() => Challenger, (challenger) => challenger.user, {
    cascade: true,
  })
  @JoinColumn({ name: 'userId' })
  challenger: Challenger[];

  @OneToMany(() => Challenge, (challenge) => challenge.user)
  @JoinColumn({ name: 'userId' })
  challenges: Challenge[];
}
