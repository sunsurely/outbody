import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InviteChallenge } from '../entities/inviteChallenge.entity';
import { CreateInviteChallengeDto } from '../dto/create-inviteChallege.dto';

@Injectable()
export class InviteChallengesRepository extends Repository<InviteChallenge> {
  constructor(private readonly dataSource: DataSource) {
    super(InviteChallenge, dataSource.createEntityManager());
  }

  async createInvitation(
    NewInvitation: CreateInviteChallengeDto,
  ): Promise<InviteChallenge> {
    const newInvitation = await this.create(NewInvitation);
    return await this.save(newInvitation);
  }

  async getInvitations(invitedId: number): Promise<InviteChallenge[]> {
    const challengeInvitations = await this.find({
      where: { invitedId },
    });
    return challengeInvitations;
  }

  async deleteInvitation(userId: number, invitedId: number) {
    const result = await this.delete({ userId, invitedId });
    return result;
  }
}
