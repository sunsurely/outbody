import { Challenger } from 'src/challenges/entities/challenger.entity';
import { Logger, Module } from '@nestjs/common';
import { ChallengesController } from './controllers/challenges.controller';
import { ChallengesService } from './services/challenges.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenge } from './entities/challenge.entity';
import { ChallengesRepository } from './repositories/challenges.repository';
import { ChallengeScheduler } from './services/challenges.scheduler';
import { UserRepository } from 'src/users/repositories/users.repository';
import { Follow } from 'src/follows/entities/follow.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Challenge, Challenger, Follow, User])],
  controllers: [ChallengesController],
  providers: [
    ChallengesService,
    ChallengesRepository,
    Logger,
    ChallengeScheduler,
    UserRepository,
  ], //ChallengeScheduler
  exports: [
    ChallengesService,
    ChallengesRepository,
    ChallengeScheduler,
    UserRepository,
  ],
})
export class ChallengeModule {}
