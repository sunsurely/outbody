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

  // 오운완 게시글에 댓글 전체 조회
  async getComment(
    challengeId: number,
    postId: number,
  ): Promise<{ comment: string; username: string }[]> {
    const allComment = await this.find({
      where: { challengeId, postId },
      order: { createdAt: 'DESC' },
      select: ['id', 'comment'],
      relations: ['user'],
    });

    const allComments = allComment.map((comment) => {
      return {
        commentId: comment.id,
        comment: comment.comment,
        username: comment.user.name,
        userImg: comment.user.imgUrl,
      };
    });

    return allComments;
  }

  // 오운완 게시글에 댓글 수정
  async updateComment(
    challengeId: number,
    postId: number,
    commentId: number,
    comment: string,
  ): Promise<Comment> {
    const updateComment = await this.update(
      { challengeId, postId, id: commentId },
      { comment },
    );
    return updateComment.raw[0];
  }

  // 댓글 유무 조회
  async existComment(commentId: number): Promise<Comment> {
    const comment = await this.findOne({
      where: { id: commentId },
    });
    return comment;
  }

  // 오운완 게시글에 댓글 삭제
  async deleteComment(
    challengeId: number,
    postId: number,
    commentId: number,
  ): Promise<any> {
    const deleteComment = await this.delete({
      challengeId,
      postId,
      id: commentId,
    });
    return deleteComment;
  }
}
