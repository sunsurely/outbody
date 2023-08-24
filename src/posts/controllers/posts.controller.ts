import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { CreatePostDto } from '../dto/create-post.dto';

@Controller('challenge')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // 오운완 인증 게시글 생성
  // http://localhost:3000/challenge/:challengeId/post
  @Post('/:challengeId/post')
  createPost(
    @Body() post: CreatePostDto,
    @Param('challengeId') challengeId: number,
    @Req() req: any,
  ) {
    const newPost = this.postsService.createPost(
      post,
      challengeId,
      req.user.id,
    );

    if (newPost) {
      return { message: '오운완 생성이 완료되었습니다.' };
    }
  }

  // 오운완 전체 조회
  // http://localhost:3000/challenge/:challengeId/post
  @Get('/:challengeId/post')
  async getAllPost(@Param('challengeId') challengeId: number) {
    return await this.postsService.getAllPost(challengeId);
  }

  // 오운완 상세 조회
  // http://localhost:3000/challenge/:challengeId/post/:postId
  @Get('/:challengeId/post/:postId')
  async getOnePost(@Param('postId') postId: number) {
    return await this.postsService.getOnePost(postId);
  }

  // 오운완 삭제
  // http://localhost:3000/challenge/:challengeId/post/:postId
  @Delete('/:challengeId/post/:postId')
  async deletePost(@Param('postId') postId: number, @Req() req: any) {
    return await this.postsService.deletePost(postId, req.user.id);
  }
}
