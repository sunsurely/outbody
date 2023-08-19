import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Challenge } from '../entities/challenge.entity';
import { CreateChallengeDto } from '../dto/create-challenge.dto';
import { LessThan, LessThanOrEqual } from 'typeorm';

@Injectable()
export class ChallengesRepository extends Repository<Challenge> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: Logger,
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
}
