import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'outbody', name: 'followMessagies' })
export class FollowMessage {
  @PrimaryGeneratedColumn({ type: 'int', name: 'followMessage' })
  id: number;

  @Column('int')
  userId: number;

  @Column('int')
  followId: number;

  @Column('varchar')
  email: string;

  @Column('varchar')
  message: string;

  @Column('boolean')
  done: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
