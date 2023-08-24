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

@Controller('chellenge')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // 오운완 게시글에 댓글 작성
  // http://localhost:3000/challenge/:challengeId/post/:postId/comment
  @Post('/:chellengeId/post/:postId/comment')
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

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
