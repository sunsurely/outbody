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
  BaseEntity,
} from 'typeorm';

@Entity({ schema: 'outbody', name: 'follows' })
export class Follow extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'follow' })
  id: number;

  @Column('int')
  userId: number;

  @Column('int')
  followId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.follows, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
