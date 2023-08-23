import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dto/create-post.dto';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostsRepository extends Repository<Post> {
  //   constructor() {}

  // 오운완 인증 게시글 생성
  async createPost(description, imgUrl, challengeId, userId) {
    const newPost = await this.create({
      description,
      imgUrl,
      challengeId,
      userId,
    });
    return await this.save(newPost);
  }
}
