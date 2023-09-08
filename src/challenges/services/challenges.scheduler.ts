import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Between, DataSource, LessThanOrEqual, Repository } from 'typeorm';
import { ChallengesRepository } from '../repositories/challenges.repository';
import { ChallengersRepository } from '../repositories/challengers.repository';
import { UserRepository } from 'src/users/repositories/users.repository';
import { Challenge } from '../entities/challenge.entity';
import { Challenger } from '../entities/challenger.entity';
import { User } from 'src/users/entities/user.entity';
import { GoalsRepository } from '../repositories/goals.repository';
import { RecordsRepository } from 'src/records/repositories/records.repository';
import { PostsRepository } from 'src/posts/repositories/posts.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class ChallengeScheduler {
  constructor(
    private readonly logger: Logger,
    private dataSource: DataSource,
    private readonly challengesRepository: ChallengesRepository,
    private readonly challengersRepository: ChallengersRepository,
    private readonly userRepository: UserRepository,
    private readonly goalRepository: GoalsRepository,
    private readonly recordRepository: RecordsRepository,
    private readonly postRepository: PostsRepository,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  // 도전 시작 알림 생성
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async createStartLog() {
    const challengesStarted = await this.challengesRepository.find({
      where: {
        startDate: LessThanOrEqual(new Date()),
        isDistributed: false,
      },
    });

    for (const challenge of challengesStarted) {
      const challengerCount =
        await this.challengersRepository.getChallengerCount(challenge.id);

      if (challengerCount > 1) {
        const challengers = await this.challengersRepository.getChallengers(
          challenge.id,
        );

        const message = '도전이 시작되었습니다.';

        for (const challenger of challengers) {
          const newNotification = await this.notificationRepository.create({
            userId: challenger.userId,
            message,
          });
          await this.notificationRepository.save(newNotification);
        }
      }
    }
  }

  // 도전 시작일이 경과하는 시점에서 참가자가 단 1명일 경우, 도전 자동 삭제
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async automaticDelete() {
    const challengesStarted = await this.challengesRepository.find({
      where: {
        startDate: LessThanOrEqual(new Date()),
        isDistributed: false,
      },
    });

    for (const challenge of challengesStarted) {
      const challengerCount =
        await this.challengersRepository.getChallengerCount(challenge.id);

      if (challengerCount === 1) {
        const challengers = await this.challengersRepository.getChallengers(
          challenge.id,
        );

        const message =
          '도전 시작일이 경과되었으나 참가자가 없어서, 회원님의 도전이 삭제되었습니다.';

        for (const challenger of challengers) {
          const newNotification = await this.notificationRepository.create({
            userId: challenger.userId,
            message,
          });
          await this.notificationRepository.save(newNotification);
        }

        const host = await this.challengersRepository.getHost(challenge.id);

        // isInChallenge: true => false
        await this.userRepository.updateUserIsInChallenge(host.userId, false);

        await this.challengesRepository.deleteChallenge(challenge.id);

        this.logger.debug(
          `도전 시작일이 경과되었으나 참가자가 없어서, ${challenge.id}번 도전이 삭제되었습니다.`,
        );
      }
    }
  }

  // 도전 종료시 점수 자동분배
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async pointDistribute(): Promise<any> {
    const challengesToDistribute = await this.challengesRepository.find({
      where: {
        endDate: LessThanOrEqual(new Date()),
        isDistributed: false,
      },
    });

    for (const challenge of challengesToDistribute) {
      const entryPoint: number = challenge.entryPoint;

      const challengers: Challenger[] =
        await this.challengersRepository.getChallengers(challenge.id);

      const succeedChallengers: Challenger[] = challengers.filter(
        (challengers) => challengers.done === true,
      );
      const failedChallengers: Challenger[] = challengers.filter(
        (challengers) => challengers.done === false,
      );

      const challengerCount: number =
        await this.challengersRepository.getChallengerCount(challenge.id);
      const totalPoint: number = challenge.entryPoint * challengerCount;

      // 모두 성공한 경우
      if (challengers.length === succeedChallengers.length) {
        for (const challenger of challengers) {
          const user: User = await this.userRepository.getUserById(
            challenger.userId,
          );
          const beforeUserPoint: number = user.point;
          let afterUserPoint: number;

          const succeedChallengerIds: number[] = succeedChallengers.map(
            (succeedChallenger) => succeedChallenger.id,
          );

          if (succeedChallengerIds.includes(challenger.id)) {
            afterUserPoint = beforeUserPoint + entryPoint;
          }

          await this.transaction(user, challenge, afterUserPoint);
        }
        // 일부만 성공한 경우
      } else {
        for (const challenger of challengers) {
          const user: User = await this.userRepository.getUserById(
            challenger.userId,
          );
          const beforeUserPoint: number = user.point;
          let afterUserPoint: number;

          const succeedChallengerIds: number[] = succeedChallengers.map(
            (succeedChallenger) => succeedChallenger.id,
          );
          const failedChallengersIds: number[] = failedChallengers.map(
            (failedChallenger) => failedChallenger.id,
          );

          if (succeedChallengerIds.includes(challenger.id)) {
            afterUserPoint =
              beforeUserPoint +
              Math.floor(totalPoint / succeedChallengers.length);
          } else if (failedChallengersIds.includes(challenger.id)) {
            afterUserPoint = beforeUserPoint - entryPoint;
          }

          await this.transaction(user, challenge, afterUserPoint);
        }
      }

      const message = '회원님이 참가한 도전이 종료되어 점수가 분배되었습니다.';

      for (const challenger of challengers) {
        const newNotification = await this.notificationRepository.create({
          userId: challenger.userId,
          message,
        });
        await this.notificationRepository.save(newNotification);
      }
    }
  }

  async transaction(user: User, challenge: Challenge, afterUserPoint: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();
      await queryRunner.manager.update(
        User,
        { id: user.id },
        { point: afterUserPoint },
      );
      await queryRunner.manager.update(
        User,
        { id: user.id },
        { isInChallenge: false },
      );
      await queryRunner.manager.update(
        User,
        { id: user.id },
        { latestChallengeDate: challenge.endDate },
      );
      await queryRunner.manager.update(
        Challenge,
        { id: challenge.id },
        { isDistributed: true },
      );
      await queryRunner.commitTransaction();
      this.logger.debug(
        `${challenge.id}번 도전이 종료되어, 점수가 정상적으로 배분되었습니다.`,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.debug(`${challenge.id}번 도전의 점수 배분에 실패하였습니다.`);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // 2주일 동안 어떠한 도전에도 참여하지 않을 시 자동으로 점수 차감 (하루에 20점)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async automaticPointDeduction() {
    const usersNotinChallenge = await this.userRepository.find({
      where: { isInChallenge: false },
    });

    for (const user of usersNotinChallenge) {
      const latestChallengeDate = user.latestChallengeDate
        ? new Date(user.latestChallengeDate)
        : user.createdAt; // 아직 어떠한 도전에도 참가하지 않은 경우

      const timeDifference =
        new Date().getTime() - latestChallengeDate.getTime();
      const dayDifference = timeDifference / (1000 * 60 * 60 * 24);

      if (dayDifference > 14) {
        const afterPoint = user.point - 20;
        await this.userRepository.updateUserPoint(user.id, afterPoint);

        const message =
          '2주일 동안 어떠한 도전에 참여하 않아, 점수가 20점 차감되었습니다.';
        const newNotification = await this.notificationRepository.create({
          userId: user.id,
          message,
        });

        await this.notificationRepository.save(newNotification);

        this.logger.debug(
          `${user.id}번 회원은 2주일 동안 어떠한 도전에도 참여하지 않아, 점수가 20점 차감되었습니다.`,
        );
      }
    }
  }

  // 도전 종료 시 성공 여부 확인 및 변환
  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async goalComplete() {
    const currentDate = new Date();
    const oneHourLater = new Date(currentDate.getTime() + 60 * 60 * 1000);

    const challenges = await this.challengesRepository.find({
      where: {
        endDate: LessThanOrEqual(oneHourLater),
        isDistributed: false,
      },
    });

    for (const challenge of challenges) {
      const challengers = await this.challengersRepository.getChallengers(
        challenge.id,
      );
      const startDate = new Date(challenge.startDate);
      startDate.setDate(startDate.getDate() - 1);
      const endDate = new Date(challenge.endDate);

      const { attend, weight, muscle, fat } = await this.goalRepository.findOne(
        {
          where: { challengeId: challenge.id },
        },
      );

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();

      try {
        for (const challenger of challengers) {
          await queryRunner.startTransaction();
          const posts = await this.postRepository.find({
            where: { createdAt: Between(startDate, endDate) },
          });
          const record = await this.recordRepository.getLatestUserRecord(
            challenger.userId,
          );

          if (
            posts.length >= attend &&
            (record.fat <= fat || fat === 0) &&
            (record.muscle >= muscle || muscle === 0) &&
            (record.weight <= weight || weight === 0)
          ) {
            await queryRunner.manager.update(
              Challenger,
              { userId: challenger.userId },
              { done: true },
            );
            const message = '도전 성공. 축하드립니다!';
            const newNotification = await this.notificationRepository.create({
              userId: challenger.userId,
              message,
            });

            await this.notificationRepository.save(newNotification);

            this.logger.debug(
              `${challenge.id}번 도전의 성공 여부가 갱신되었습니다.`,
            );
            await queryRunner.commitTransaction();
          }

          const message = '도전 실패. 다음에 더 잘해봅시다!';
          const newNotification = await this.notificationRepository.create({
            userId: challenger.userId,
            message,
          });
          await this.notificationRepository.save(newNotification);
        }
      } catch (error) {
        await queryRunner.rollbackTransaction();
        this.logger.debug(
          `${challenge.id}번 도전의 성공 여부 갱신에 실패하였습니다.`,
        );
        throw error;
      } finally {
        await queryRunner.release();
      }
    }
  }
}
