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
import { Gender, Provider, Status } from '../userInfo';
import { Record } from 'src/records/entities/records.entity';
import { Follow } from '../../follows/entities/follow.entity';
import { Report } from '../../reports/entities/report.entity';
import { Challenger } from 'src/challenges/entities/challenger.entity';
import { Challenge } from 'src/challenges/entities/challenge.entity';
import { BlackList } from 'src/reports/entities/blacklist.entity';
import { Like } from 'src/likes/entities/like.entity';
import { Post } from 'src/posts/entities/post.entity';

@Entity({ schema: 'outbody', name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 30 })
  name: string;

  @Column('date')
  birthday: Date;

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

  @Column({ type: 'int', default: 1000 })
  point: number;

  @Column({ type: 'enum', enum: Status, default: Status.NORMAL })
  status: Status;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Record, (record) => record.user, { cascade: true })
  records: Record[];

  @OneToMany(() => Follow, (follow) => follow.follower, { cascade: true })
  followers: Follow[];

  @OneToMany(() => Follow, (follow) => follow.followed, { cascade: true })
  followeds: Follow[];

  @OneToMany(() => Report, (report) => report.user)
  @JoinColumn({ name: 'userId' })
  reports: Report[];

  @OneToMany(() => Challenger, (challenger) => challenger.user, {
    cascade: true,
  })
  challenger: Challenger[];

  @OneToMany(() => Challenge, (challenge) => challenge.user)
  challenges: Challenge[];

  @OneToMany(() => BlackList, (blacklist) => blacklist.user)
  blacklists: BlackList[];

  @OneToMany(() => Like, (like) => like.user, {
    cascade: true,
  })
  like: Like[];

  @OneToMany(() => Post, (post) => post.user)
  post: Post[];
}
