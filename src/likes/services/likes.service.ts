import { ChallengesRepository } from './../../challenges/repositories/challenges.repository';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LikesRepository } from '../repositories/likes.repository';
import { PostsRepository } from 'src/posts/repositories/posts.repository';
import { Like } from '../entities/like.entity';

@Injectable()
export class LikesService {
  constructor(
    private readonly likesRepository: LikesRepository,
    private readonly challengesRepository: ChallengesRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  // 오운완 좋아요 생성
  async createLike(challengeId: number, postId: number, userId: number) {
    const challenge = await this.challengesRepository.getChallenge(challengeId);
    if (!challenge || challenge == undefined) {
      throw new NotFoundException('해당 도전이 조회되지 않습니다.');
    }
    const post = await this.postsRepository.getOnePost(postId);
    if (!post || post == undefined) {
      throw new NotFoundException('해당 오운완 게시글이 조회되지 않습니다.');
    }
    console.log('userId', userId);
    const clickedUser = await this.likesRepository.getUserInfo(postId, userId);
    if (clickedUser) {
      throw new BadRequestException('이미 좋아요를 누른 게시글입니다.');
    }

    const like = await this.likesRepository.createLike(postId, userId);
    return like;
  }

  // 오운완 게시글당 좋아요수 조회
  async likesCount(
    challengeId: number,
    postId: number,
  ): Promise<[Like[], number]> {
    const challenge = await this.challengesRepository.getChallenge(challengeId);
    if (!challenge || challenge == undefined) {
      throw new NotFoundException('해당 도전이 조회되지 않습니다.');
    }
    const post = await this.postsRepository.getOnePost(postId);
    if (!post || post == undefined) {
      throw new NotFoundException('해당 오운완 게시글이 조회되지 않습니다.');
    }

    const [likes, likeCount] = await this.likesRepository.likesCount(postId);
    return [likes, likeCount];
  }

  // 오운완 좋아요 삭제
  async deleteLike(
    challengeId: number,
    postId: number,
    likeId: number,
    userId: number,
  ) {
    const challenge = await this.challengesRepository.getChallenge(challengeId);
    if (!challenge || challenge == undefined) {
      throw new NotFoundException('해당 도전이 조회되지 않습니다.');
    }
    const post = await this.postsRepository.getOnePost(postId);
    if (!post || post == undefined) {
      throw new NotFoundException('해당 오운완 게시글이 조회되지 않습니다.');
    }
    const clickedUser = await this.likesRepository.getUserInfo(postId, userId);
    // const like = await this.likesRepository.getLike(likeId);

    if (!clickedUser) {
      throw new NotFoundException(
        '해당 오운완 게시글에 좋아요를 누르지 않았습니다.',
      );
    }
    return await this.likesRepository.deleteLike(likeId);
  }

  // 유저가 누른 좋아요 조회
  async usersLikes(userId: number): Promise<[Like[], number]> {
    return this.likesRepository.usersLikes(userId);
  }
}
