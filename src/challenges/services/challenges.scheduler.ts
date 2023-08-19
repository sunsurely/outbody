import { Cron, CronExpression } from '@nestjs/schedule';
import { ChallengesRepository } from '../repositories/challenges.repository';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ChallengeScheduler {
  private readonly logger = new Logger(ChallengeScheduler.name);

  constructor(private readonly challengesRepository: ChallengesRepository) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    this.logger.debug('도전 게시글을 삭제 중입니다...');
    await this.challengesRepository.automaticDelete();
  }
}
