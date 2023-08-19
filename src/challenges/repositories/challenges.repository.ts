import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Challenge } from '../entities/challenge.entity';
import { CreateChallengeDto } from '../dto/create-challenge.dto';

@Injectable()
export class ChallengesRepository extends Repository<Challenge> {
  constructor(private readonly dataSource: DataSource) {
    super(Challenge, dataSource.createEntityManager());
  }

  async createChallenge(Challenge: CreateChallengeDto): Promise<Challenge> {
    const newChallenge = await this.create(Challenge);
    return await this.save(newChallenge);
  }
}
