import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Challenger } from '../entities/challenger.entity';
import { CreateChallengerDto } from '../dto/create-challengers.dto';
import { Answer } from '../challengerInfo';
import { ResponseChallengeDto } from '../dto/response-challenge.dto';

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

  // 도전자 1명조회
  async getChallenger(challengeId: number): Promise<Challenger> {
    const challengers = await this.findOne({
      where: { challengeId },
    });
    return challengers;
  }

  //도전자 퇴장
  async deleteChallenger(challengeId: number, userId: number): Promise<void> {
    const challenger = await this.findOne({
      where: { challengeId, userId },
    });
    await this.remove(challenger);
  }

  // // 도전자 초대수락 후 생성
  // async acceptChallenge(
  //   challengeId: number,
  //   userId: number,
  // ): Promise<Challenger> {
  //   const newChallenger = this.create({ challengeId, userId });
  //   return this.save(newChallenger);
  // }
}
