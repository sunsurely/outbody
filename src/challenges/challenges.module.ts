import { Logger, Module } from '@nestjs/common';
import { ChallengesController } from './controllers/challenges.controller';
import { ChallengesService } from './services/challenges.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenge } from './entities/challenge.entity';
import { ChallengesRepository } from './repositories/challenges.repository';
import { ChallengeScheduler } from './services/challenges.scheduler';

@Module({
  imports: [TypeOrmModule.forFeature([Challenge])],
  controllers: [ChallengesController],
  providers: [
    ChallengesService,
    ChallengesRepository,
    Logger,
    ChallengeScheduler,
  ], //ChallengeScheduler
  exports: [ChallengesService, ChallengesRepository, ChallengeScheduler], //ChallengeScheduler
})
export class ChallengeModule {}
