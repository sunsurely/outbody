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

@Entity({ schema: 'outbody', name: 'records' })
export class RecordEntity {
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => UserEntity, (user) => user.records)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
