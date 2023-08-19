import { Module } from '@nestjs/common';
import { ChallengesController } from './controllers/challenges.controller';
import { ChallengesService } from './services/challenges.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenge } from './entities/challenge.entity';
import { ChallengesRepository } from './repositories/challenges.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Challenge])],
  controllers: [ChallengesController],
  providers: [ChallengesService, ChallengesRepository],
  exports: [ChallengesService, ChallengesRepository],
})
export class ChallengeModule {}
