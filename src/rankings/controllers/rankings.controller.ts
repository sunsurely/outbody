import { Controller, Get, Req } from '@nestjs/common';
import { RankingsService } from '../services/rankings.service';

@Controller('rank')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  // 전체 순위 조회
  // GET http://localhost:3000/rank/total
  @Get('/total')
  async getTotalRank() {
    return await this.rankingsService.getTotalRank();
  }

  // 친구 순위 조회
  // GET http://localhost:3000/rank/followings
  @Get('/followings')
  async getFollowingRank(@Req() req: any) {
    return await this.rankingsService.getFollowingRank(req.user.id);
  }
}
