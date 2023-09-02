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
  @PrimaryGeneratedColumn({ type: 'int', name: 'inviteChallenge' })
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
