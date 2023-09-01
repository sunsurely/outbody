import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Challenge } from '../entities/challenge.entity';
import { CreateChallengeDto } from '../dto/create-challenge.dto';
import { Goal } from '../entities/goal.entity';
import { Challenger } from '../entities/challenger.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ChallengesRepository extends Repository<Challenge> {
  constructor(private readonly dataSource: DataSource) {
    super(Challenge, dataSource.createEntityManager());
  }

  // 도전 생성
  async createChallenge(Challenge: CreateChallengeDto): Promise<Challenge> {
    const newChallenge = await this.create(Challenge);
    return await this.save(newChallenge);
  }

  // 도전 목록 조회 (전체)
  async getChallenges(): Promise<Challenge[]> {
    const challenges = await this.createQueryBuilder('challenge')
      .leftJoin(Goal, 'goal', 'goal.challengeId = challenge.id')
      .leftJoin(User, 'user', 'user.id = challenge.userId')
      .leftJoin(
        Challenger,
        'challenger',
        'challenger.challengeId = challenge.id',
      )
      .select([
        'challenge.id AS id',
        'challenge.title AS title',
        'challenge.description AS description',
        'challenge.startDate AS startDate',
        'challenge.challengeWeek AS challengeWeek',
        'challenge.endDate AS endDate',
        'challenge.createdAt AS createdAt',
        'challenge.entryPoint AS entryPoint',
        'challenge.userNumberLimit AS userNumberLimit',
        'challenge.publicView As publicView',
        'goal.attend AS attend',
        'goal.weight AS weight',
        'goal.muscle AS muscle',
        'goal.fat AS fat',
        'user.name AS hostName',
        'COUNT(challenge.id) AS userNumber',
      ])
      .groupBy('challenge.id')
      .getRawMany();
    return challenges;
  }

  // 도전 상세 조회
  async getChallenge(challengeId: number): Promise<Challenge> {
    const challenge = await this.createQueryBuilder('challenge')
      .leftJoin('challenge.goal', 'goal')
      .leftJoin('challenge.user', 'user')
      .select([
        'challenge.id',
        'challenge.userId',
        'challenge.title',
        'challenge.description',
        'challenge.startDate',
        'challenge.endDate',
        'challenge.entryPoint',
        'challenge.userNumberLimit',
        'goal.attend',
        'goal.weight',
        'goal.muscle',
        'goal.fat',
        'user.name',
        'user.point',
      ])
      .where('challenge.id = :id', { id: challengeId })
      .getOne();
    return challenge;
  }

  // 도전 삭제
  async deleteChallenge(challengeId: number): Promise<any> {
    const result = await this.delete(challengeId);
    return result;
  }
}
