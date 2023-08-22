import { Cron, CronExpression } from '@nestjs/schedule';
import { ChallengesRepository } from '../repositories/challenges.repository';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ChallengeScheduler {
  private readonly logger = new Logger(ChallengeScheduler.name);

  constructor(private readonly challengesRepository: ChallengesRepository) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    await this.challengesRepository.automaticDelete();
  }
}
