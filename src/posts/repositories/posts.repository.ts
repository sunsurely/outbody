import { Injectable } from '@nestjs/common';
import { DataSource, MoreThanOrEqual, Repository } from 'typeorm';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostsRepository extends Repository<Post> {
  constructor(private readonly dataSource: DataSource) {
    super(Post, dataSource.createEntityManager());
  }

  // 오운완 인증 게시글 생성
  async createPost(
    description: string,
    imgUrl: string,
    challengeId: number,
    userId: number,
  ): Promise<Post> {
    const newPost = await this.create({
      description,
      imgUrl,
      challengeId,
      userId,
    });
    await this.save(newPost);

    return newPost;
  }

  // 오늘 게시글을 올렸는지 확인
  async existTodayPost(userId: number): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = await this.count({
      where: {
        userId,
        createdAt: MoreThanOrEqual(today),
      },
    });

    return count > 0;
  }

  // 오운완 전체 조회
  async getAllPost(challengeId: number): Promise<Post[]> {
    const allPost = await this.find({
      where: { challengeId },
      order: { createdAt: 'DESC' },
    });
    return allPost;
  }

  // 오운완 상세 조회
  async getOnePost(postId: number): Promise<Post> {
    const onePost = await this.findOne({
      where: { id: postId },
    });
    return onePost;
  }

  // 오운완 삭제
  async deletePost(postId: number): Promise<any> {
    const deletePost = await this.delete(postId);

    return deletePost;
  }

  // 오운완 작성자 조회 (상우)
  async getUserById(userId: number): Promise<Post> {
    const author = await this.findOne({
      where: { userId },
    });
    return author;
  }
}
