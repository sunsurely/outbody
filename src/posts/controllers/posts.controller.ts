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

  @Get('/:challengeId/post')
  findAll() {
    return this.postsService.findAll();
  }

  @Get('/:challengeId/post/:postid')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch('/:challengeId/post/:postid')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete('/:challengeId/post/:postid')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
