import { Injectable } from '@nestjs/common';
import { DataSource, MoreThanOrEqual, Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from '../dto/create-post.dto';

@Injectable()
export class PostsRepository extends Repository<Post> {
  constructor(private readonly dataSource: DataSource) {
    super(Post, dataSource.createEntityManager());
  }

  // 오운완 인증 게시글 생성
  async createPost(Post: CreatePostDto): Promise<Post> {
    const newPost = await this.create(Post);
    return await this.save(newPost);
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

  // 오운완 전체 조회 (재용 수정)
  async getAllPost(
    challengeId: number,
    page: number,
    pageSize: number,
  ): Promise<Post[]> {
    const allPosts = await this.find({
      where: { challengeId },
      select: [
        'id',
        'challengeId',
        'userId',
        'imgUrl',
        'description',
        'createdAt',
      ],
      order: { createdAt: 'DESC' },
      relations: ['user'],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return allPosts;
  }

  // 오운완 상세 조회
  async getOnePost(postId: number): Promise<{
    challengeId: number;
    postId: number;
    userId: number;
    description: string;
    imgUrl: string;
    comment: string;
  }> {
    const getOnePost = await this.findOne({
      where: { id: postId },
      relations: ['user'],
    });

    const onePost = {
      challengeId: getOnePost.challengeId,
      postId: getOnePost.id,
      userId: getOnePost.userId,
      description: getOnePost.description,
      imgUrl: getOnePost.imgUrl,
      username: getOnePost.user.name,
      comment: getOnePost.user.description,
      userImg: getOnePost.user.imgUrl,
    };
    return onePost;
  }

  // 오운완 삭제
  async deletePost(postId: number): Promise<any> {
    const deletePost = await this.delete(postId);

    return deletePost;
  }

  // 유저가 생성한 오운완 수 + 목록조회
  async getUserPosts(userId: number): Promise<[Post[], number]> {
    return await this.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
