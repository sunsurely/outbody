import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { Status } from '../challenge.status';

@Entity({ schema: 'outbody', name: 'notification' })
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Status, default: Status.START })
  status: Status;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;
}
