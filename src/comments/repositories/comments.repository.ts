import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class CommentsRepository extends Repository<Comment> {
  constructor(private readonly dataSource: DataSource) {
    super(Comment, dataSource.createEntityManager());
  }

  // 오운완 게시글에 댓글 작성
  async createComment(
    comment: string,
    challengeId: number,
    postId: number,
    userId: number,
  ): Promise<Comment> {
    const newComment = await this.create({
      comment,
      challengeId,
      postId,
      userId,
    });
    await this.save(newComment);

    return newComment;
  }
}
