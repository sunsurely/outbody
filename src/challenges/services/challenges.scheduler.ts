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

  @Cron(CronExpression.EVERY_SECOND)
  async pointCrom() {
    this.logger.debug('저 살아있습니다!');
    await this.challengesRepository.pointsDistribute();
  }
}
