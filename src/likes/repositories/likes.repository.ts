import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Like } from '../entities/like.entity';

@Injectable()
export class LikesRepository extends Repository<Like> {
  // constructor(private readonly dataSource: DataSource) {
  //   super(Like, dataSource.createEntityManager());
  // }

  // 좋아요 생성
  async createLike(postId: number, userId: number): Promise<Like> {
    const newLike = await this.create({
      postId,
      userId,
    });
    return await this.save(newLike);
  }

  // 좋아요 조회
  async getLikes(postId: number): Promise<Like[]> {
    const likes = await this.find({
      where: { postId },
    });
    return likes;
  }

  // 좋아요 취소
  async deleteLike(likeId: number): Promise<any> {
    await this.delete(likeId);
  }

  // 유저 조회
  async getUserInfo(userId: number): Promise<Like> {
    const likedUser = await this.findOne({ where: { userId: userId } });
    console.log('likedUser', likedUser);
    return likedUser;
  }
}
