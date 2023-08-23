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
import { LikesService } from '../services/likes.service';

@Controller('challenge')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  // 오운완 좋아요 생성 (상우)
  // http://localhost:3000/challenge/:challengeId/post/:postId/like
  @Post('/:challengeId/post/:postId/like')
  async createLike(
    @Param('challengeId') challengeId: number,
    @Param('postId') postId: number,
    @Req() req: any,
  ) {
    const like = await this.likesService.createLike(
      challengeId,
      postId,
      req.user.id,
    );
    if (like) {
      return { message: `${postId} 게시글에 좋아요를 눌렀습니다.` };
    }
  }

  // 오운완 좋아요 조회 (상우)
  // http://localhost:3000/challenge/:challengeId/post/:postId/like
  @Get('/:challengeId/post/:postId/like')
  async getLikes(
    @Param('challengeId') challengeId: number,
    @Param('postId') postId: number,
  ) {
    const likes = await this.likesService.getLikes(challengeId, postId);
    return likes;
  }

  // 오운완 좋아요 취소 (상우)
  // http://localhost:3000/challenge/:challengeId/post/:postId/like/:likeId
  @Delete('/:challengeId/post/:postId/like/:likeId')
  async deleteLike(
    @Param('challengeId') challengeId: number,
    @Param('postId') postId: number,
    @Param('likeId') likeId: number,
    @Req() req: any,
  ) {
    const unlike = await this.likesService.deleteLike(
      challengeId,
      postId,
      likeId,
      req.user.id,
    );
    if (unlike) {
      return { message: `${postId} 게시글 좋아요를 취소했습니다.` };
    }
  }
}
