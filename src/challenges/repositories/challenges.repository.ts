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
      .where('challenge.startDate <= :today', { today })
      .having('challengerCount <= 1')
      .getMany();

    for (const challenge of challengesToDelete) {
      await this.remove(challenge);
      this.logger.debug(
        `도전 시작일이 경과되었으나 참가자가 없어서, 도전이 삭제되었습니다.`,
      );
    }
  }

  // 도전 종료시 점수 자동분배 (상우, 재용)
  async pointsDistribute(): Promise<any> {
    const today = new Date();

    const endChallenges = await this.find({
      where: {
        endDate: LessThanOrEqual(today),
      },
    });

    const challengeIds = endChallenges.map((challenge) => challenge.id);

    for (const challengeId of challengeIds) {
      const challenge = await this.getChallenge(challengeId);

      const entryPoint = challenge.entryPoint; // 개인 참가 점수

      const users = await this.challengersRepository.getChallengers(
        challengeId,
      );

      const succeedUsers = users.filter((user) => user.done === true); // 성공한 회원 목록
      const failedUsers = users.filter((user) => user.done === false); // 실패한 회원 목록

      const challengerCount =
        await this.challengersRepository.getChallengerCount(challengeId);

      const totalPoint = challenge.entryPoint * challengerCount; // 사용자 참가 점수 합계

      if (users.length === succeedUsers.length) {
        // 모두 성공한 경우
        const entityManager = this.userRepository.manager;

        await entityManager.transaction(async (transactionalEntityManager) => {
          const challengers = await this.challengersRepository.getChallengers(
            challengeId,
          );

          for (const challenger of challengers) {
            const user = await this.userRepository.getUserById(
              challenger.userId,
            );

            let userPoint = user.point;

            if (succeedUsers.includes(challenger)) {
              userPoint += entryPoint;
            }

            await transactionalEntityManager.update(
              User,
              { id: user.id },
              { point: userPoint },
            );
          }
        });
      } else {
        // 일부만 성공한 경우
        const entityManager = this.userRepository.manager;

        await entityManager.transaction(async (transactionalEntityManager) => {
          const challengers = await this.challengersRepository.getChallengers(
            challengeId,
          );

          for (const challenger of challengers) {
            const user = await this.userRepository.getUserById(
              challenger.userId,
            );

            let userPoint = user.point;

            if (succeedUsers.includes(challenger)) {
              userPoint += Math.floor(totalPoint / succeedUsers.length);
            } else if (failedUsers.includes(challenger)) {
              userPoint -= entryPoint;
            }

  //           await transactionalEntityManager.update(
  //             User,
  //             { id: user.id },
  //             { point: userPoint },
  //           );
  //         }
  //       });
  //     }
  //     this.logger.debug(
  //       `${challengeId}번 도전이 종료되어, 점수가 정상적으로 배분되었습니다.`,
  //     );
  //   }
  // }
}
