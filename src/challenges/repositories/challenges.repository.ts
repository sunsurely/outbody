import { UserRepository } from 'src/users/repositories/users.repository';
import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Challenge } from '../entities/challenge.entity';
import { Challenger } from '../entities/challenger.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateChallengeDto } from '../dto/create-challenge.dto';
import { LessThan } from 'typeorm';
import { Position } from '../challengerInfo';
import { Follow } from 'src/follows/entities/follow.entity';

@Injectable()
export class ChallengesRepository extends Repository<Challenge> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: Logger,
    private readonly userRepository: UserRepository,
  ) {
    super(Challenge, dataSource.createEntityManager());
  }

  // 도전 생성
  async createChallenge(Challenge: CreateChallengeDto): Promise<Challenge> {
    const newChallenge = await this.create(Challenge);
    return await this.save(newChallenge);
  }

  // 도전 목록조회
  async getChallenges(): Promise<Challenge[]> {
    const challenges = await this.find();
    return challenges;
  }

  // 도전 상세조회
  async getChallenge(challengeId: number): Promise<Challenge> {
    const challenge = await this.findOne({
      where: { id: challengeId },
    });
    return challenge;
  }

  // 도전 삭제
  async deleteChallenge(challengeId): Promise<any> {
    const result = await this.delete(challengeId);
    console.log(typeof result);
    return result;
  }

  // 자동삭제 (도전 시작일이 지나고 사용자가 1명(본인)밖에 없을 경우)
  async automaticDelete(): Promise<void> {
    const today = new Date().toISOString();
    const challengerCount = await this.getChallengeCount();
    const challengesToDelete = await this.find({
      where: {
        startDate: LessThan(today),
      },
    });

    if (challengesToDelete.length > 0 && challengerCount <= 1) {
      await this.remove(challengesToDelete);
      this.logger.debug(
        `도전 시작일이 경과되었으나 도전 참가자가 없어서, 회원님의 ${challengesToDelete} 도전이 삭제되었습니다.`,
      );
    }
  }

  // 도전 친구초대
  async inviteChallenge(challengeId: number, friend: Follow): Promise<void> {
    const newChallenger: Partial<Challenger> = {
      challengeId,
      userId: friend.id,
      type: Position.GUEST,
      done: false,
    };

    await this.createQueryBuilder('challenger')
      .insert()
      .values(newChallenger)
      .execute();
  }

  // 도전자 참가자 수 조회
  async getChallengeCount(): Promise<number> {
    return await this.createQueryBuilder('challenger')
      .select('COUNT(challenger.id)', 'count')
      .getRawOne()
      .then((result) => result.count);
  }
}
