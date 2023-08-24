import { Injectable } from '@nestjs/common';
import { RankingsRepository } from '../repositories/rankings.repository';

@Injectable()
export class RankingsService {
  constructor(private readonly rankingsRepository: RankingsRepository) {}

  // 전체 순위 조회
  async getTotalRank() {
    return await this.rankingsRepository.getTotalRank();
  }
}
