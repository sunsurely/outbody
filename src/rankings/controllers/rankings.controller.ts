import { Controller, Get } from '@nestjs/common';
import { RankingsService } from '../services/rankings.service';

@Controller('rank')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  // 전체 순위 조회
  @Get('/total')
  async getTotalRank() {
    return await this.rankingsService.getTotalRank();
  }
}
