import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RankingsRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  // 전체 순위 조회
  async getTotalRank(): Promise<{ name: string; point: number }[]> {
    const totalRank = await this.find({
      order: { point: 'DESC' },
      select: ['name', 'point'],
    });

    return totalRank;
  }

  // 사용자가 팔로우한 Id userId로 조회
  async followUserId(userId: number): Promise<number[]> {
    // 현재 유저를 follows 테이블까지 참조해 조회
    const followUser = await this.find({
      relations: ['follows'],
      where: {
        follows: {
          userId,
        },
      },
    });

    // 조회한 유저가 팔로우한 followId 모두를 조회
    const followUserId = followUser.flatMap((user) =>
      user.follows.map((follow) => follow.followId),
    );
    return followUserId;
  }

  // 친구 순위 조회
  async getFollowingRank(followUserId: number[]): Promise<User[]> {
    const getFollowingRank = await this.find({
      where: { id: In(followUserId) },
      order: { point: 'DESC' },
      select: ['name', 'point'],
    });
    console.log(getFollowingRank);
    return getFollowingRank;
  }
}
