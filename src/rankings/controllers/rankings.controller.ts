import { Controller, Get, Req, Query } from '@nestjs/common';
import { RankingsService } from '../services/rankings.service';

@Controller('rank')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  // 전체 순위 조회 pageSize개씩 조회
  // GET http://localhost:3000/rank/total/?page=page&pageSize=pageSize
  @Get('/total/page')
  async getTotalRank(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.rankingsService.getTotalRank(page, pageSize);
  }

  // 친구 순위 조회 pageSize개씩 조회
  // GET http://localhost:3000/rank/followings/?page=page&pageSize=pageSize
  @Get('/followings/page')
  async getFollowingRank(
    @Req() req: any,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.rankingsService.getFollowingRank(
      req.user.id,
      page,
      pageSize,
    );
  }
}
