import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

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
  findAll(@Param('challengeId') challengeId: number) {
    return this.postsService.findAll(challengeId);
  }

  @Get('/:challengeId/post/:postid')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Delete('/:challengeId/post/:postid')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
