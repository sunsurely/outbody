import { Injectable, NotImplementedException } from '@nestjs/common';
import { FollowsRepository } from '../repositories/follows.repository';

@Injectable()
export class FollowsService {
  constructor(private readonly followRepository: FollowsRepository) {}

  //팔로우 기능
  async updateFollow(followedUserId: number, followingUserId: number) {
    const follow = await this.followRepository.getFollowById(
      followedUserId,
      followingUserId,
    );

    if (follow) {
      const result = await this.followRepository.deleteFollower(
        followedUserId,
        followingUserId,
      );
      if (!result) {
        throw new NotImplementedException('요청 작업에 실패했습니다.');
      }
      return result;
    }

    const createFollow = await this.followRepository.createFollower(
      followedUserId,
      followingUserId,
    );

    if (!createFollow) {
      throw new NotImplementedException('요청 작업에 실패했습니다.');
    }

    return;
  }
}
