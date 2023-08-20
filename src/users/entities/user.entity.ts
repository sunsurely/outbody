import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Gender, Provider } from '../userInfo';
import { Record } from 'src/recodes/recodes.entity';
import { Follow } from './follow.entity';
import { Report } from './report.entity';

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

  @Column('int', { nullable: true })
  point: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => Record, (record) => record.user)
  records: Record[];

  @OneToMany(() => Follow, (following) => following.follower)
  @JoinColumn({ name: 'followingUserId' })
  followings: Follow[];

  @OneToMany(() => Follow, (followed) => followed.followedUser)
  @JoinColumn({ name: 'followedUserId' })
  followeds: Follow[];

  @OneToMany(() => Report, (reporting) => reporting.reporter)
  @JoinColumn({ name: 'reporterId' })
  reportings: Report[];

  @OneToMany(() => Report, (reported) => reported.reportedUser)
  @JoinColumn({ name: 'reportedUserId' })
  reporteds: Report[];
}
