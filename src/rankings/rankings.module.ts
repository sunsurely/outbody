import { Module } from '@nestjs/common';
import { RankingsService } from './services/rankings.service';
import { RankingsController } from './controllers/rankings.controller';
import { RankingsRepository } from './repositories/rankings.repository';

@Module({
  controllers: [RankingsController],
  providers: [RankingsService, RankingsRepository],
})
export class RankingsModule {}
