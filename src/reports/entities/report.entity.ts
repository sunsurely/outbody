import { User } from 'src/users/entities/user.entity';
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
export class Report {
  @PrimaryGeneratedColumn({ type: 'int', name: 'reportId' })
  id: number;

  @Column('int')
  userId: number;

  @Column('int')
  commentId: number;

  @Column('varchar')
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.reports)
  @JoinColumn({ name: 'userId' })
  user: User;
}
