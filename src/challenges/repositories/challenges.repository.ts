import { ChallengersRepository } from './challengers.repository';
import { UserRepository } from 'src/users/repositories/users.repository';
import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository, LessThanOrEqual } from 'typeorm';
import { Challenge } from '../entities/challenge.entity';
import { CreateChallengeDto } from '../dto/create-challenge.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ChallengesRepository extends Repository<Challenge> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: Logger,
    private readonly userRepository: UserRepository,
    private readonly challengersRepository: ChallengersRepository,
  ) {
    super(Challenge, dataSource.createEntityManager());
  }

  // 도전 생성 (재용)
  async createChallenge(Challenge: CreateChallengeDto): Promise<Challenge> {
    const newChallenge = await this.create(Challenge);
    return await this.save(newChallenge);
  }

  // 도전 목록조회 (상우)
  async getChallenges(): Promise<Challenge[]> {
    const challenges = await this.find();
    return challenges;
  }

  // 도전 상세조회 (상우)
  async getChallenge(challengeId: number): Promise<Challenge> {
    const challenge = await this.findOne({
      where: { id: challengeId },
    });
    return challenge;
  }

  // 도전 삭제 (상우, 재용)
  // 도전 시작일 전, 참가한 회원이 없을 경우에만 삭제 가능
  async deleteChallenge(challengeId: number): Promise<any> {
    const result = await this.delete(challengeId);
    return result;
  }

  // 자동 삭제 (상우, 재용)
  // 도전 시작일이 경과하는 시점에서 참가자가 단 1명일 경우
  async automaticDelete(): Promise<void> {
    const today = new Date();

    const challengesToDelete = await this.createQueryBuilder('challenge')
      .leftJoinAndSelect('challenge.challenger', 'challenger')
      .addSelect((subQuery) => {
        subQuery
          .select('COUNT(subChallenger.id)', 'challengerCount')
          .from('challenger', 'subChallenger')
          .where('subChallenger.challengeId = challenge.id');
        return subQuery;
      }, 'challengerCount')
      .where('challenge.startDate <= :today', { today: today.toISOString() })
      .having('challengerCount <= 1')
      .getMany();

    for (const challenge of challengesToDelete) {
      await this.remove(challenge);
      this.logger.debug(
        `도전 시작일이 경과되었으나 참가자가 없어서, 도전이 삭제되었습니다.`,
      );
    }
  }

  // 도전 방 종료시 포인트 자동분배 (상우)
  // async pointsDistribute(): Promise<any> {
  //   const today = new Date(); // 현재날짜
  //   const todayString = today.toISOString();
  //   const endChallenges = await this.find({
  //     where: {
  //       endDate: LessThanOrEqual(todayString),
  //     },
  //   });
  //   const challengeIds = endChallenges.map((challenge) => challenge.id);
  //   for (const challengeId of challengeIds) {
  //     const challenge = await this.getChallenge(challengeId);
  //     const entryPoint = challenge.entryPoint; // 1인당 참가비용

  //     const users = await this.challengersRepository.getChallengers(
  //       challengeId,
  //     );
  //     // 참가한 전체유저
  //     const succeedUsers = users.filter((user) => user.done); // 성공한 유저목록
  //     const failedUsers = users.filter((user) => !user.done); // 실패한 유저목록
  //     const totalPoint = challenge.entryPoint * Number(users); // 전체유저가 입장시 낸 포인트

  //     if (users.length === succeedUsers.length) {
  //       // 도전자 모두 성공한 경우 += 엔트리포인트
  //       const entityManager = this.userRepository.manager;
  //       await entityManager.transaction(async (transactionalEntityManager) => {
  //         for (const challenger of challenge.challenger) {
  //           const user = challenger.user;
  //           let userPoint = user.point;

  //           if (succeedUsers.includes(challenger)) {
  //             userPoint += entryPoint;
  //           }
  //           await transactionalEntityManager.update(
  //             User,
  //             { id: user.id },
  //             { point: userPoint },
  //           );
  //         }
  //       });
  //     } else {
  //       // 도전자중 일부만 성공한 경우
  //       const entityManager = this.userRepository.manager;
  //       await entityManager.transaction(async (transactionalEntityManager) => {
  //         for (const challenger of challenge.challenger) {
  //           const user = challenger.user;
  //           let userPoint = user.point;

  //           // 성공유저 = 전체포인트/성공유저수 && 실패유저 =-엔트리포인트
  //           if (succeedUsers.includes(challenger)) {
  //             userPoint += Math.floor(totalPoint / Number(succeedUsers));
  //           } else if (failedUsers.includes(challenger)) {
  //             userPoint -= entryPoint;
  //           }

            await transactionalEntityManager.update(
              User,
              { id: user.id },
              { point: userPoint },
            );
          }
        });
      }
      this.logger.debug(
        `${challengeId}번 도전이 종료되어, 점수가 정상적으로 배분되었습니다.`,
      );
    }
  }
}
