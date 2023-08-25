import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Challenge } from '../entities/challenge.entity';
import { CreateChallengeDto } from '../dto/create-challenge.dto';

@Injectable()
export class ChallengesRepository extends Repository<Challenge> {
  constructor(
    private readonly logger: Logger,
    private readonly dataSource: DataSource,
  ) {
    super(Challenge, dataSource.createEntityManager());
  }

  // 도전 생성 (재용)
  async createChallenge(Challenge: CreateChallengeDto): Promise<Challenge> {
    const newChallenge = await this.create(Challenge);
    return await this.save(newChallenge);
  }

  // 도전 목록조회 (상우)
  async getChallenges(): Promise<Challenge[]> {
    const challenges = await this.find();
    return challenges;
  }

  // 도전 상세조회 (상우)
  async getChallenge(challengeId: number): Promise<Challenge> {
    const challenge = await this.findOne({
      where: { id: challengeId },
    });
    return challenge;
  }

  // 도전 삭제 (상우, 재용)
  // 도전 시작일 전, 참가한 회원이 없을 경우에만 삭제 가능
  async deleteChallenge(challengeId: number): Promise<any> {
    const result = await this.delete(challengeId);
    return result;
  }

  // 자동 삭제 (상우, 재용)
  // 도전 시작일이 경과하는 시점에서 참가자가 단 1명일 경우
  async automaticDeleteChallenge(): Promise<void> {
    const challengesToDelete = await this.createQueryBuilder('challenge')
      .leftJoinAndSelect('challenge.challenger', 'challenger')
      .addSelect((subQuery) => {
        subQuery
          .select('COUNT(inChallenger.id)', 'challengerCount')
          .from('challenger', 'inChallenger')
          .where('inChallenger.challengeId = challenge.id');
        return subQuery;
      }, 'challengerCount')
      .where('challenge.startDate <= :today', { today: new Date() })
      .having('challengerCount <= 1')
      .getMany();

    for (const challenge of challengesToDelete) {
      await this.remove(challenge);
      this.logger.debug(
        `도전 시작일이 경과되었으나 참가자가 없어서, 도전이 삭제되었습니다.`,
      );
    }
  }
}
