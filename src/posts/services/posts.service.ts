import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostsRepository } from '../repositories/posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  // 오운완 인증 게시글 생성
  async createPost(post: CreatePostDto, challengeId: number, userId: number) {
    const { description, imgUrl } = post;
    // 오늘 게시글을 올렸는지 확인
    const existTodayPost = await this.postsRepository.existTodayPost(userId);

    if (existTodayPost) {
      throw new ConflictException('하루에 한 번만 게시글을 올릴 수 있습니다.');
    }
    if (!post.description) {
      throw new BadRequestException('내용을 모두 입력해주세요.');
    }

    await this.postsRepository.createPost(
      description,
      imgUrl,
      challengeId,
      userId,
    );
  }

  // 오운완 전체 조회
  async getAllPost(challengeId: number) {
    return await this.postsRepository.getAllPost(challengeId);
  }

  // 오운완 상세 조회
  async getOnePost(postId: number) {
    return await this.postsRepository.getOnePost(postId);
  }

  // 오운완 삭제
  async deletePost(postId: number) {
    return await this.postsRepository.deletePost(postId);
  }
}
