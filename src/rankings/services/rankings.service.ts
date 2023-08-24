import { Injectable, NotFoundException } from '@nestjs/common';
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

    // 친구가 없다면
    if (followUserId.length === 0) {
      throw new NotFoundException('친구가 없어 순위 조회가 불가능합니다.');
    }

    // followUserId 함수로 가져온 유저들 Id로 유저 조회를 해서 name과 point만 가져옴
    const allFollowingUser = await this.rankingsRepository.getFollowingRank(
      followUserId,
    );

    return allFollowingUser;
  }
}
