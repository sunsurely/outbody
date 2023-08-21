import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Challenger } from '../entities/challenger.entity';
import { CreateChallengerDto } from '../dto/create-challengers.dto';

@Injectable()
export class ChallengersRepository extends Repository<Challenger> {
  constructor(private readonly dataSource: DataSource) {
    super(Challenger, dataSource.createEntityManager());
  }

  // 도전자 생성
  async createChallenger(challenger: CreateChallengerDto): Promise<Challenger> {
    const newChallenger = this.create(challenger);
    return this.save(newChallenger);
  }

  // 도전자 조회
  async getChallengers(challengeId: number): Promise<Challenger[]> {
    const challengers = await this.find({
      where: { challengeId },
    });
    return challengers;
  }

  // 도전자 삭제
  async deleteChallenger(criteria: Partial<Challenger>): Promise<void> {
    await this.delete(criteria);
  }
}
