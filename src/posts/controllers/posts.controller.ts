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
  async createPost(
    @Body() post: CreatePostDto,
    @Param('challengeId') challengeId: number,
    @Req() req: any,
  ) {
    return await this.postsService.createPost(post, challengeId, req.user.id);
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

  // 유저가 생성한 오운완수 + 오운완목록조회
  // http://localhost:3000/challenge/post/user
  @Get('/post/user')
  async getUserPosts(@Req() req: any) {
    const userId = req.user.id;
    const [posts, userPostsCount] = await this.postsService.getUserPosts(
      userId,
    );

    const usersPosts = posts.map((post) => {
      return {
        postId: post.id,
        description: post.description,
      };
    });

    return {
      totalPosts: userPostsCount,
      usersPosts: usersPosts,
    };
  }
}
