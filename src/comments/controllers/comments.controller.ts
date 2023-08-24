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
import { CommentsService } from '../services/comments.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';

@Controller('challenge')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // 오운완 게시글에 댓글 작성
  // http://localhost:3000/challenge/:chellengeId/post/:postId/comment
  @Post('/:challengeId/post/:postId/comment')
  createComment(
    @Body() createCmt: CreateCommentDto,
    @Param('challengeId') challengeId: number,
    @Param('postId') postId: number,
    @Req() req: any,
  ) {
    const newComment = this.commentsService.createComment(
      createCmt,
      challengeId,
      postId,
      req.user.id,
    );

    if (newComment) {
      return { message: '댓글이 작성되었습니다.' };
    }
  }

  // 오운완 게시글에 댓글 전체 조회
  // http://localhost:3000/challenge/:challengeId/post/:postId/comment
  @Get('/:challengeId/post/:postId/comment')
  async getComment(
    @Param('challengeId') challengeId: number,
    @Param('postId') postId: number,
  ) {
    return await this.commentsService.getComment(challengeId, postId);
  }

  // 오운완 게시글에 댓글 수정
  // http://localhost:3000/challenge/:challengeId/post/:postId/comment/:commentId
  @Patch('/:challengeId/post/:postId/comment/:commentId')
  updateComment(
    @Param('challengeId') challengeId: number,
    @Param('postId') postId: number,
    @Param('commentId') commentId: number,
    @Req() req: any,
    @Body() updateCmt: UpdateCommentDto,
  ) {
    const updateComment = this.commentsService.updateComment(
      challengeId,
      postId,
      commentId,
      req.user.id,
      updateCmt,
    );

    if (updateComment) {
      return { message: '댓글이 수정되었습니다.' };
    }
  }

  // 오운완 게시글에 댓글 삭제
  // http://localhost:3000/challenge/:challengeId/post/:postId/comment/:commentId
  @Delete('/:challengeId/post/:postId/comment/:commentId')
  async deleteComment(
    @Param('challengeId') challengeId: number,
    @Param('postId') postId: number,
    @Param('commentId') commentId: number,
    @Req() req: any,
  ) {
    const deleteComment = await this.commentsService.deleteComment(
      challengeId,
      postId,
      commentId,
      req.user.id,
    );
    if (deleteComment) {
      return { message: '댓글이 삭제되었습니다.' };
    }
  }
}
