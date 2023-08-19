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

@Entity({ schema: 'outbody', name: 'reports' })
export class ReportEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'reportId' })
  id: number;

  @Column('int')
  reporterId: number;

  @Column('int')
  reportedUserId: number;

  @Column('varchar')
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => UserEntity, (reporter) => reporter.reportings)
  @JoinColumn({ name: 'reporterId' })
  reporter: UserEntity;

  @ManyToOne(() => UserEntity, (reportedUser) => reportedUser.reporteds)
  @JoinColumn({ name: 'reportedUserId' })
  reportedUser: UserEntity;
}
