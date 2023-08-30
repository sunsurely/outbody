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

  // 도전 목록조회 (전체)
  async getChallenges(): Promise<Challenge[]> {
    const challenges = await this.createQueryBuilder('challenge')
      .select([
        'challenge.id AS id',
        'challenge.title AS title',
        'challenge.description AS description',
        'challenge.startDate AS startDate',
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
        'COUNT(challenger.id) AS userNumber',
      ])
      .innerJoin(Goal, 'goal', 'goal.challengeId = challenge.id')
      .leftJoinAndSelect(
        Challenger,
        'challenger',
        'challenger.challengeId = challenge.id',
      )
      .leftJoinAndSelect(User, 'user', 'user.id = challenger.userId')
      .where('challenger.type = :type', { type: 'host' })
      .groupBy('challenge.id')
      .getRawMany();
    return challenges;
  }

  // 도전 상세조회
  async getChallenge(challengeId: number): Promise<Challenge> {
    const challenge = await this.createQueryBuilder('challenge')
      .leftJoinAndSelect('challenge.goal', 'goal')
      .leftJoin('challenge.user', 'user')
      .leftJoin('challenge.challenger', 'challenger')
      .addSelect('COUNT(challenger.id)')
      .select([
        'challenge.id',
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
        'COUNT(challenger.id) AS userNumber',
      ])
      .where('challenge.id = :id', { id: challengeId })
      .groupBy('challenge.id')
      .getOne();
    console.log(challenge);
    return challenge;
  }

  // 도전 삭제
  async deleteChallenge(challengeId: number): Promise<any> {
    const result = await this.delete(challengeId);
    return result;
  }
}
