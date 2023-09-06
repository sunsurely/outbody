import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { CreatePostRequestDto } from '../dto/create-post.request.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('challenge')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // 오운완 인증 게시글 생성
  // http://localhost:3000/challenge/:challengeId/post
  @Post('/:challengeId/post')
  @UseInterceptors(FileInterceptor('image'))
  async createPost(
    @Param(
      'challengeId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    challengeId: number,
    @Body() body: CreatePostRequestDto,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.postsService.createPost(
      challengeId,
      body,
      req.user.id,
      file,
    );
  }

  // 오운완 전체 조회
  // http://localhost:3000/challenge/:challengeId/post
  @Get('/:challengeId/post')
  async getAllPost(
    @Param(
      'challengeId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    challengeId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.postsService.getAllPost(challengeId, page, pageSize);
  }

  // 오운완 상세 조회
  // http://localhost:3000/challenge/:challengeId/post/:postId
  @Get('/:challengeId/post/:postId')
  async getOnePost(
    @Param(
      'postId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    postId: number,
  ) {
    return await this.postsService.getOnePost(postId);
  }

  // 오운완 삭제
  // http://localhost:3000/challenge/:challengeId/post/:postId
  @Delete('/:challengeId/post/:postId')
  async deletePost(
    @Param(
      'postId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    postId: number,
    @Req() req: any,
  ) {
    return await this.postsService.deletePost(postId, req.user);
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

  // 모든 도전의 모든 오운완 조회 (비공개도전 제외)
  // http://localhost:3000/challenge/publishedpost/allpost
  // http://localhost:3000/challenge/publishedpost/allpost/?page=page&pageSize=pageSize
  @Get('/publishedpost/allpost')
  async getPublicPosts(
    @Req() req: any,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    const userId = req.user.id;
    return await this.postsService.getPublicPosts(userId, page, pageSize);
  }
}
