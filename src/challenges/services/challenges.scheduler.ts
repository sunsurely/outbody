import { RecordsRepository } from './../../records/repositories/records.repository';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ChallengesRepository } from '../repositories/challenges.repository';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ChallengeScheduler {
  constructor(
    private readonly challengesRepository: ChallengesRepository,
  ) // private readonly recordsRepository: RecordsRepository,
  {}
  private readonly logger = new Logger(
    ChallengeScheduler.name,
    // RecordsRepository.name,
  );

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    await this.challengesRepository.automaticDelete();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async pointCron() {
    await this.challengesRepository.pointDistribute();
  }

  // @Cron(CronExpression.EVERY_MINUTE)
  // async outbodyCron() {
  //   await this.recordsRepository.bodyStatusRecord();
  // }
}
