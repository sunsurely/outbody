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

@Entity({ schema: 'outbody', name: 'records' })
export class Record {
  @PrimaryGeneratedColumn({ type: 'int', name: 'recordId' })
  id: number;

  @Column('int')
  userId: number;

  @Column('int')
  bmr: number;

  @Column('int')
  weight: number;

  @Column('int')
  muscle: number;

  @Column('int')
  fat: number;

  @Column('date')
  date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.records)
  @JoinColumn({ name: 'userId' })
  user: User;
}
