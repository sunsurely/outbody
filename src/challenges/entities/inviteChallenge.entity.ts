import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'outbody', name: 'invitechallengies' })
export class InviteChallenge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  userId: number;

  @Column('int')
  invitedId: number;

  @Column('varchar')
  email: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  message: string;

  @Column('int')
  challengeId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
