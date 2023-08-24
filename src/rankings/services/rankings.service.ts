import { Injectable } from '@nestjs/common';
import { RankingsRepository } from '../repositories/rankings.repository';

@Injectable()
export class RankingsService {
  constructor(private readonly rankingsRepository: RankingsRepository) {}

  // 전체 순위 조회
  async getTotalRank() {
    return await this.rankingsRepository.getTotalRank();
  }

  // 친구 순위 조회
  async getFollowingRank(userId: number) {
    // 사용자의 친구들(followId)을 가져오기 위한 조회
    const followUserId = await this.rankingsRepository.followUserId(userId);

    // 사용자 친구들 순위 포인트와 이름만 조회
    const allFollowingUser = await this.rankingsRepository.getFollowingRank(
      followUserId,
    );

    return allFollowingUser;
  }
}
