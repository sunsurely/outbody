import { Injectable } from '@nestjs/common';
import { Follow } from 'src/follows/entities/follow.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class FollowsRepository extends Repository<Follow> {
  constructor(private readonly dataSource: DataSource) {
    super(Follow, dataSource.createEntityManager());
  }

  //친구 추가  followedUserId:  팔로우를 당하는 유저 ,    followingUserId: 팔로우를 거는 유저
  async createFollower(followedUserId: number, followingUserId: number) {
    const follow = await this.create({ followedUserId, followingUserId });
    return await this.save(follow);
  }

  async getFollowById(followedUserId: number, followingUserId: number) {
    return await this.findOne({
      where: { followedUserId, followingUserId },
    });
  }

  //언팔로우
  async deleteFollower(followedUserId: number, followingUserId: number) {
    return await this.delete({ followedUserId, followingUserId });
  }
}
