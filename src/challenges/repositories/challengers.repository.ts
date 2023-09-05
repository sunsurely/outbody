import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Challenger } from '../entities/challenger.entity';
import { CreateChallengerDto } from '../dto/create-challengers.dto';
import { User } from 'src/users/entities/user.entity';

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

  // 도전 생성자 조회
  async getHost(challengeId: number): Promise<Challenger> {
    const host = await this.findOne({
      where: { challengeId },
    });
    return host;
  }

  // 특정 도전 내 도전자 상세 조회
  async getChallenger(
    challengeId: number,
    userId: number,
  ): Promise<Challenger> {
    const challenger = await this.findOne({
      where: { challengeId, userId },
    });
    return challenger;
  }

  // 전체 도전 내 도전자 상세 조회
  async getChallengerWithUserId(userId) {
    const challenger = await this.findOne({
      where: { userId, done: false },
    });
    return challenger;
  }

  // 특정 도전 내 도전자 전체 조회
  async getChallengers(challengeId: number): Promise<Challenger[]> {
    const challengers = await this.createQueryBuilder('challenger')
      .leftJoin(User, 'user', 'user.id = challenger.userId')
      .where('challenger.challengeId = :id', { id: challengeId })
      .select([
        'user.name AS userName',
        'user.point AS userPoint',
        'user.imgUrl AS userImageUrl',
      ])
      .getRawMany();
    return challengers;
  }

  // 도전자 삭제
  async deleteChallenger(challengeId: number, userId: number): Promise<void> {
    const challenger = await this.findOne({
      where: { challengeId, userId, done: false },
    });
    await this.remove(challenger);
  }

  // 도전자 수 조회
  async getChallengerCount(challengeId: number): Promise<number> {
    const challengersCount = await this.count({
      where: {
        challengeId,
      },
    });
    return challengersCount;
  }
}
