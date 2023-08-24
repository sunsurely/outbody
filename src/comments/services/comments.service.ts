import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { CommentsRepository } from '../repositories/comments.repository';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}
  // 오운완 게시글에 댓글 작성
  async createComment(
    createCmt: CreateCommentDto,
    challengeId: number,
    postId: number,
    userId: number,
  ) {
    const { comment } = createCmt;

    if (!createCmt.comment) {
      throw new BadRequestException('댓글을 입력해주세요.');
    }

    await this.commentsRepository.createComment(
      comment,
      challengeId,
      postId,
      userId,
    );
  }

  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
