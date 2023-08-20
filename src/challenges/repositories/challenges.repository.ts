import { UserRepository } from 'src/users/repositories/users.repository';
import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Challenge } from '../entities/challenge.entity';
import { Challenger } from '../entities/challenger.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateChallengeDto } from '../dto/create-challenge.dto';
import { LessThan, LessThanOrEqual } from 'typeorm';
import { InviteChallengeDto } from '../dto/invite-challenge.dto';

@Injectable()
export class ChallengesRepository extends Repository<Challenge> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: Logger,
    private readonly userRepository: UserRepository,
  ) {
    super(Challenge, dataSource.createEntityManager());
  }

  async createChallenge(Challenge: CreateChallengeDto): Promise<Challenge> {
    const newChallenge = await this.create(Challenge);
    return await this.save(newChallenge);
  }

  // 도전그룹 상세조회
  async getChallenge(challengeId: number): Promise<Challenge> {
    const challenge = await this.findOne({
      where: { id: challengeId },
    });
    return challenge;
  }

  // 도전그룹 목록조회
  async getChallenges(): Promise<Challenge[]> {
    const challenges = await this.find();
    return challenges;
  }

  // 도전 삭제
  async deleteChallenge(challengeId): Promise<any> {
    await this.delete(challengeId);
  }

  // 자동삭제 (도전 시작일이 지나고 사용자가 본인밖에 없을 경우)
  async automaticDelete(): Promise<void> {
    const today = new Date().toISOString();
    const challengesToDelete = await this.find({
      where: {
        startDate: LessThan(today),
        userNumberLimit: LessThanOrEqual(1),
      },
    });

    if (challengesToDelete.length > 0) {
      await this.remove(challengesToDelete);
      this.logger.debug(
        `도전 시작일이 경과되었으나 도전 참가자가 없어서, 회원님의 ${challengesToDelete}도전이 자동 삭제되었습니다.`,
      );
    }
  }

  // 도전 친구초대
  async inviteChallenge(challengeId: number, invitedUser: User): Promise<void> {
    const challenge = await this.getChallenge(challengeId);
    if (!challenge) {
      throw new NotFoundException('도전 그룹을 찾을 수 없습니다.');
    }

    // 내가 팔로우하는 유저목록
    const follwedUsers = await this.userRepository.getCurrentUserById(
      invitedUser.id,
    );
    // 초대된 사용자가 내 친구인지 확인
    const isFollowing = follwedUsers.some((user) => user.id === invitedUser.id);
    if (!isFollowing) {
      throw new UnauthorizedException('초대할 수 있는 친구가 아닙니다.');
    }
    // 초대된 참가자가 이미 참가한 도전자인지 확인
    const existingChallenger = await this.createQueryBuilder('challenger')
      .where('challenger.challengeId = :challengeId', { challengeId })
      .andWhere('challenger.userId = :userId', { userId: invitedUser.id })
      .getOne();
    if (existingChallenger) {
      throw new BadRequestException('이미 도전에 참가한 친구입니다.');
    }

    const newChallenger: Partial<Challenger> = {
      challengeId,
      userId: invitedUser.id,
      authorization: 'guest', // 적절한 권한 값으로 설정해야함.
      done: false,
    };

    await this.createQueryBuilder('challenger')
      .insert()
      .values(newChallenger)
      .execute();
  }
}
