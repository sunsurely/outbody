import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Challenger } from '../entities/challenger.entity';
import { CreateChallengerDto } from '../dto/create-challengers.dto';

@Injectable()
export class ChallengersRepository extends Repository<Challenger> {
  constructor(private readonly dataSource: DataSource) {
    super(Challenger, dataSource.createEntityManager());
  }

  // 도전자 생성 (재용)
  async createChallenger(challenger: CreateChallengerDto): Promise<Challenger> {
    const newChallenger = this.create(challenger);
    return this.save(newChallenger);
  }

  // 도전자 목록조회 (재용)
  async getChallengers(challengeId: number): Promise<Challenger[]> {
    const challengers = await this.find({
      where: { challengeId },
    });
    return challengers;
  }

  // 도전 생성자 조회 (재용)
  async getHost(challengeId: number): Promise<Challenger> {
    const host = await this.findOne({
      where: { challengeId },
    });
    return host;
  }

  // 특정 도전 내 도전자 조회 (상우, 재용)
  async getChallenger(
    challengeId: number,
    userId: number,
  ): Promise<Challenger> {
    const challenger = await this.findOne({
      where: { challengeId, userId },
    });
    return challenger;
  }

  // 도전자 퇴장 (상우, 재용)
  async deleteChallenger(challengeId: number, userId: number): Promise<void> {
    const challenger = await this.findOne({
      where: { challengeId, userId, done: false },
    });
    await this.remove(challenger);
  }

  // 도전자 수 조회 (재용)
  async getChallengerCount(challengeId: number): Promise<number> {
    const challengersCount = await this.count({
      where: {
        challengeId,
      },
    });
    return challengersCount;
  }
}
