import { Cron, CronExpression } from '@nestjs/schedule';
import { ChallengesRepository } from '../repositories/challenges.repository';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ChallengeScheduler {
  constructor(private readonly challengesRepository: ChallengesRepository) {}
  private readonly logger = new Logger(ChallengeScheduler.name);

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    await this.challengesRepository.automaticDelete();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async pointCron() {
    await this.challengesRepository.pointDistribute();
  }
}
