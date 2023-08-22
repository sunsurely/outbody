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

  // 도전 생성 (재용)
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

  // 도전 삭제 (상우, 재용)
  async deleteChallenge(challengeId): Promise<any> {
    const result = await this.delete(challengeId);
    return result;
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

  // 회원 정보조회 // CurrentUser
  async getCurrentUserById(userId: number): Promise<any> {
    const queryBuilder = await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.gender',
        'user.age',
        'user.height',
        'user.comment',
        'user.point',
      ])
      .where('user.id = :userId', { userId })
      .leftJoinAndSelect('user.followers', 'follower')
      .leftJoinAndSelect('follower.followed', 'followed')
      .addSelect(['followed.id', 'followed.name', 'followed.imgUrl']);

    const users = await queryBuilder.getMany();

    const transformedUsers = users.map((user) => {
      const transformedFollowers = user.followers.map((follower) => {
        return {
          id: follower.followed.id,
          name: follower.followed.name,
          imgUrl: follower.followed.imgUrl,
        };
      });

      return {
        id: user.id,
        name: user.name,
        age: user.age,
        height: user.height,
        email: user.email,
        gender: user.gender,
        comment: user.comment,
        point: user.point,
        followers: transformedFollowers,
      };
    });
    return transformedUsers;
  }

  // 도전자 수 조회 (상우, 재용)
  async getChallengerCount(challengeId: number): Promise<number> {
    const challengersCount = await this.count({
      where: {
        id: challengeId,
      },
    });
    return challengersCount;
  }
}
