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
  async getAllChallengesCount(): Promise<number> {
    const allChallengesCount = await this.createQueryBuilder('challenge')
      .innerJoin('challenge.user', 'user')
      .where('challenge.userId = user.id')
      .andWhere('user.deletedAt IS NULL')
      .getCount();
    return allChallengesCount;
  }

  // 전체 도전 목록 조회 (pagenation)
  async getAllChallenges(page: number): Promise<Challenge[]> {
    const allChallenges = await this.createQueryBuilder('challenge')
      .innerJoin('challenge.user', 'user')
      .where('challenge.userId = user.id')
      .andWhere('user.deletedAt IS NULL')
      .orderBy('challenge.createdAt', 'DESC')
      .skip((page - 1) * 10)
      .take(10)
      .getMany();
    return allChallenges;
  }

  // 참여 가능한 도전 목록 조회
  async getPossibleChallengesCount(userPoint: number): Promise<number> {
    const possibleChallengesCount = await this.createQueryBuilder('challenge')
      .innerJoin('challenge.user', 'user')
      .where('challenge.userId = user.id')
      .andWhere('user.deletedAt IS NULL')
      .andWhere('challenge.startDate > :today', { today: new Date() })
      .andWhere('challenge.publicView = true')
      .andWhere('challenge.entryPoint <= :userPoint', { userPoint })
      .getCount();
    return possibleChallengesCount;
  }

  // 참여 가능한 도전 목록 조회 (pagenation)
  async getPossibleChallenges(
    page: number,
    userPoint: number,
  ): Promise<Challenge[]> {
    const possibleChallenges = await this.createQueryBuilder('challenge')
      .innerJoin('challenge.user', 'user')
      .where('challenge.userId = user.id')
      .andWhere('user.deletedAt IS NULL')
      .andWhere('challenge.startDate > :today', { today: new Date() })
      .andWhere('challenge.publicView = true')
      .andWhere('challenge.entryPoint <= :userPoint', { userPoint })
      .orderBy('challenge.createdAt', 'DESC')
      .skip((page - 1) * 10)
      .take(10)
      .getMany();
    return possibleChallenges;
  }

  // 내 도전 목록 조회
  async getMyChallengesCount(userId: number): Promise<number> {
    const myChallengesCount = await this.createQueryBuilder('challenge')
      .innerJoin('challenge.challenger', 'challenger')
      .where('challenger.userId = :userId', { userId })
      .getCount();
    return myChallengesCount;
  }

  // 내 도전 목록 조회 (pagenation)
  async getMyChallenges(page: number, userId: number): Promise<Challenge[]> {
    const myChallenges = await this.createQueryBuilder('challenge')
      .innerJoin('challenge.challenger', 'challenger')
      .where('challenger.userId = :userId', { userId })
      .orderBy('challenge.createdAt', 'DESC')
      .skip((page - 1) * 10)
      .take(10)
      .getMany();
    return myChallenges;
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
