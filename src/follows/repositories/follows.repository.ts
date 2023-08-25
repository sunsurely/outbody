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
  //친구 여부 조회
  async getFollowById(followId: number, userId: number) {
    return await this.findOne({
      where: { followId, userId },
    });
  }
  async getUsersFollow(userId: number): Promise<any> {
    const usersFollowed = await this.createQueryBuilder('follow')
      .leftJoinAndSelect('follow.user', 'follower')
      .leftJoinAndSelect('follow.followed', 'followed')
      .where('(follow.userId = :userId OR follow.followId = :userId)', {
        userId,
      })
      .select([
        'follower.id AS followerId',
        'follower.imgUrl AS followerImgUrl',
        'follower.name AS followerName',
        'followed.id AS followedId',
        'followed.imgUrl AS followedImgUrl',
        'followed.name AS followedName',
      ])
      .getMany();

    // return usersFollowed.map((follow) => ({
    //   follower: {
    //     id: follow.id,
    //     imgUrl: follow.imgUrl,
    //     name: follow.follower.name,
    //   },
    //   followed: {
    //     id: follow.followed.id,
    //     imgUrl: follow.followed.imgUrl,
    //     name: follow.name,
    //   },
    // }));
  }

  //친구삭제
  async deleteFollower(userId: number, followId: number) {
    const deleted = await this.delete({ followId, userId });
    return deleted;
  }
}
