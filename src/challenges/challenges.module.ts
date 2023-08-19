import { Module } from '@nestjs/common';
import { ChallengesService } from './services/challenges.service';
import { ChallengesController } from './controllers/challenges.controller';

@Module({
  controllers: [ChallengesController],
  providers: [ChallengesService],
})
export class ChallengeModule {}
