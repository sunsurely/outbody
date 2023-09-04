import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Challenge } from '../entities/challenge.entity';
import { CreateChallengeDto } from '../dto/create-challenge.dto';

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

  // 전체 도전 목록 조회
  async getAllChallenges(): Promise<Challenge[]> {
    const challenges = await this.createQueryBuilder('challenge')
      .innerJoin('challenge.user', 'user')
      .where('challenge.userId = user.id')
      .andWhere('user.deletedAt IS NULL')
      .getMany();
    return challenges;
  }

  // 전체 도전 목록 조회 (pagenation)
  async getPageChallenges(page): Promise<Challenge[]> {
    const challenges = await this.createQueryBuilder('challenge')
      .innerJoin('challenge.user', 'user')
      .where('challenge.userId = user.id')
      .andWhere('user.deletedAt IS NULL')
      .orderBy('challenge.createdAt', 'DESC')
      .skip((page - 1) * 10)
      .take(10)
      .getMany();
    return challenges;
  }

  // 참여 가능한 도전 목록 조회
  async getPossibleChallenges(userPoint): Promise<Challenge[]> {
    const challenges = await this.createQueryBuilder('challenge')
      .innerJoin('challenge.user', 'user')
      .where('challenge.userId = user.id')
      .andWhere('user.deletedAt IS NULL')
      .where('challenge.startDate > :today', { today: new Date() })
      .where('challenge.publicView = true')
      .where('challenge.entryPoint <= :userPoint', { userPoint })
      .getMany();
    return challenges;
  }

  // 내 도전 목록 조회
  async getMyChallenges(userId: number): Promise<Challenge[]> {
    const challenges = await this.createQueryBuilder('challenge')
      .innerJoin('challenge.challenger', 'challenger')
      .where('challenger.userId = :userId', { userId })
      .getMany();
    return challenges;
  }

  // 도전 상세 조회
  async getChallenge(challengeId: number): Promise<Challenge> {
    const challenge = await this.findOne({ where: { id: challengeId } });
    return challenge;
  }

  // 도전 삭제
  async deleteChallenge(challengeId: number): Promise<any> {
    const result = await this.delete(challengeId);
    return result;
  }

  // 사용자가 생성한 도전의 수, 도전 목록 조회
  async getUserChallenges(userId: number): Promise<[Challenge[], number]> {
    return await this.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
