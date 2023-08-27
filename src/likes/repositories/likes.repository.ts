import { UserLoginDto } from './../../auth/dto/userLogin.dto';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Like } from '../entities/like.entity';

@Injectable()
export class LikesRepository extends Repository<Like> {
  constructor(private readonly dataSource: DataSource) {
    super(Like, dataSource.createEntityManager());
  }

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
      order: { createdAt: 'DESC' },
    });
    return likes;
  }

  // 좋아요 취소
  async deleteLike(likeId: number): Promise<any> {
    return await this.delete(likeId);
  }

  // 좋아요 사용자 조회
  async getUserInfo(postId: number, userId: number): Promise<Like> {
    const likedUser = await this.findOne({
      where: { postId, userId },
    });
    return likedUser;
  }

  // 유저가 누른 좋아요 조회
  async usersLikes(userId: number): Promise<[Like[], number]> {
    return await this.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: ['post'],
    });
  }
}
