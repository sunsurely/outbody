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

  // 도전자 조회 (상우)
  async getChallenger(challengeId: number): Promise<Challenger> {
    const challenger = await this.findOne({
      where: { challengeId },
    });
    return challenger;
  }

  // 도전자 조회 (재용)
  async getChallengerByUserId(userId: number): Promise<Challenger> {
    const challenger = await this.findOne({
      where: { userId, done: false },
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
