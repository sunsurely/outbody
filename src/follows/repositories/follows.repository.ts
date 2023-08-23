import { Injectable } from '@nestjs/common';
import { Follow } from 'src/follows/entities/follow.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class FollowsRepository extends Repository<Follow> {
  constructor(private readonly dataSource: DataSource) {
    super(Follow, dataSource.createEntityManager());
  }

  //친구추가
  async createFollow(followId: number, userId: number) {
    const follow = await this.create({ followId, userId });
    return await this.save(follow);
  }
  //추가한 친구조회
  async getFollowById(followId: number, userId: number) {
    return await this.findOne({
      where: { followId, userId },
    });
  }

  //친구삭제
  async deleteFollower(userId: number, followId: number) {
    const deleted = await this.delete({ followId, userId });
    return deleted;
  }
}
