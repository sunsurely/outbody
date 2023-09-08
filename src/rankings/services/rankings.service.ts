import { Injectable, NotFoundException } from '@nestjs/common';
import { RankingsRepository } from '../repositories/rankings.repository';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RankingsService {
  constructor(private readonly rankingsRepository: RankingsRepository) {}

  // 전체 순위 조회
  async getTotalRank(page: number, pageSize: number) {
    const totalRanks = await this.rankingsRepository.getTotalRank();
    if (!totalRanks || totalRanks.length <= 0) {
      throw new NotFoundException('데이터가 존재하지 않습니다.');
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    const totalPages = Math.ceil(totalRanks.length / pageSize);
    const paginationTotalRanks = totalRanks.slice(startIndex, endIndex);

    return { totalPages, paginationTotalRanks };
  }

  // 친구 순위 조회
  async getFollowingRank(userId: number, page: number, pageSize: number) {
    const followUserId: number[] = await this.rankingsRepository.followUserId(
      userId,
    );
    const followerUserId: number[] =
      await this.rankingsRepository.follwerUserId(userId);

    // 친구가 없다면
    if (followUserId.length === 0 && followerUserId.length === 0) {
      throw new NotFoundException(
        '등록된 친구가 없어서, 순위 조회가 불가능합니다.',
      );
    }

    const userIdArray: number[] = followUserId.concat(followerUserId);

    // followUserId 함수로 가져온 유저들 Id로 유저 조회를 해서 name과 point만 가져옴
    const followerRanks: User[] =
      await this.rankingsRepository.getFollowingRank(userIdArray);

    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    const totalPages = Math.ceil(followerRanks.length / pageSize);
    const paginationFollowerRanks = followerRanks.slice(startIndex, endIndex);

    return { totalPages, paginationFollowerRanks };
  }
}
