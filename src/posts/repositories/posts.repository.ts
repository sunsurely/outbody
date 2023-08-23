import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dto/create-post.dto';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostsRepository extends Repository<Post> {
  //   constructor() {}

  // 오운완 인증 게시글 생성
  async createPost(description, imgUrl, challengeId, userId): Promise<Post> {
    const newPost = await this.create({
      description,
      imgUrl,
      challengeId,
      userId,
    });
    return newPost;
  }

  // 오운완 전체 조회
  async findAll(challengeId): Promise<Post[]> {
    const allPost = await this.findAll({
      where: { challengeId },
    });
    return allPost;
  }

  // 오운완 상세 조회
  async findOne(challengeId: number, postId: number): Promise<Post> {
    const onePost = await this.findOne({
      where: { challengeId, id: postId },
    });

    return onePost;
  }
}
