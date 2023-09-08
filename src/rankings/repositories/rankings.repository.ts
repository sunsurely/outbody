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
      select: ['name', 'point', 'createdAt'],
    });

    return totalRank;
  }

  // 사용자가 팔로우한 Id userId로 조회
  async followUserId(userId: number): Promise<number[]> {
    // 현재 로그인한 유저를 조회하는데 follows 테이블까지 참조해서 조회
    const followUser = await this.find({
      relations: ['follows'],
      where: {
        follows: {
          userId,
        },
      },
    });

    // 현재 로그인한 유저가 팔로우한 유저의 Id(followId)만 가져옴
    const followUserId = followUser.flatMap((user) =>
      user.follows.map((follow) => follow.followId),
    );
    return followUserId;
  }

  // 사용자를 팔로우한 Id 조회
  async follwerUserId(userId: number): Promise<number[]> {
    const followerUser = await this.find({
      relations: ['follows'],
      where: {
        follows: {
          followId: userId,
        },
      },
    });

    const followerUserId = followerUser.flatMap((user) =>
      user.follows.map((follow) => follow.userId),
    );
    return followerUserId;
  }

  // 친구 순위 조회
  async getFollowingRank(followUserId: number[]): Promise<User[]> {
    // followUserId 함수로 가져온 유저들 Id로 유저 조회를 해서 name과 point만 가져옴
    const getFollowingRank = await this.find({
      where: { id: In(followUserId) },
      order: { point: 'DESC' },
      select: ['name', 'point', 'createdAt'],
    });

    return getFollowingRank;
  }
}
