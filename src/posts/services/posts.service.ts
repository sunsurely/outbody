import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { CreatePostRequestDto } from '../dto/create-post.request.dto';
import { PostsRepository } from '../repositories/posts.repository';
import { AwsService } from '../../aws.service';
import { Post } from '../entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { ChallengersRepository } from 'src/challenges/repositories/challengers.repository';
import { ChallengesRepository } from 'src/challenges/repositories/challenges.repository';

@Injectable()
export class PostsService {
  constructor(
    private readonly awsService: AwsService,
    private readonly postsRepository: PostsRepository,
    private readonly challengersRepository: ChallengersRepository,
    private readonly challengesRepository: ChallengesRepository,
  ) {}

  // 오운완 인증 게시글 생성
  async createPost(
    challengeId: number,
    post: CreatePostRequestDto,
    userId: number,
    file: Express.Multer.File,
  ) {
    const challenge = await this.challengesRepository.getChallenge(challengeId);
    const endDate = new Date(challenge.endDate);
    const twoHourBefore = endDate.getTime() - 2 * 60 * 60 * 1000;
    if (
      new Date() < new Date(challenge.startDate) ||
      new Date() > new Date(twoHourBefore)
    ) {
      throw new BadRequestException(
        '오운완 인증 게시글은 도전 기간 내에만 작성이 가능합니다.',
      );
    }

    const { description } = post;
    if (!description) {
      throw new BadRequestException('내용을 입력해주세요.');
    }

    const isInThisChallenge = await this.challengersRepository.getChallenger(
      challengeId,
      userId,
    );
    if (!isInThisChallenge) {
      throw new BadRequestException(
        '도전에 참가한 회원만 오운완 인증 게시글을 작성할 수 있습니다.',
      );
    }

    // 오늘 게시글을 올렸는지 확인
    const existTodayPost = await this.postsRepository.existTodayPost(userId);
    if (existTodayPost) {
      throw new ConflictException(
        '오운완 인증 게시글은 하루에 한 번만 올릴 수 있습니다.',
      );
    }

    const imageObject = await this.awsService.uploadImage('outbody_post', file);

    await this.postsRepository.createPost({
      challengeId,
      userId,
      imgUrl: imageObject.key,
      description,
    });
  }

  // 오운완 전체 조회
  async getAllPost(challengeId: number, page: number, pageSize: number) {
    const totalCount: number = await this.postsRepository.getAllPostsCount(
      challengeId,
    );
    const totalPages: number = Math.ceil(totalCount / pageSize);

    const posts: Post[] = await this.postsRepository.getAllPosts(
      challengeId,
      page,
      pageSize,
    );

    const result = posts.map((post) => {
      const postObject = {
        id: post.id,
        userId: post.userId,
        imgUrl: post.imgUrl,
        description: post.description,
        userName: post.user.name,
        userImageUrl: post.user.imgUrl,
        userPoint: post.user.point,
        createdAt: post.createdAt,
      };
      return postObject;
    });
    return { totalPages, result };
  }

  // 오운완 상세 조회
  async getOnePost(postId: number) {
    return await this.postsRepository.getOnePost(postId);
  }

  // 오운완 삭제 (상우)
  async deletePost(postId: number, user: User) {
    const post = await this.postsRepository.getOnePost(postId);

    if (post.userId !== user.id) {
      throw new NotAcceptableException(
        '본인이 만든 오운완 게시글만 삭제 가능합니다.',
      );
    }

    await this.awsService.deleteImage(post.imgUrl);

    return await this.postsRepository.deletePost(postId);
  }

  // 유저가 생성한 오운완수 + 오운완목록조회
  async getUserPosts(userId: number): Promise<[Post[], number]> {
    return this.postsRepository.getUserPosts(userId);
  }

  // 모든 도전의 모든 오운완 불러오기 (비공개도전 제외)
  async getPublicPosts(page, pageSize) {
    const allPosts = await this.postsRepository.getPublicPosts();

    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    const totalPages = Math.ceil(allPosts.length / pageSize);

    const pagenatedTotalPosts = allPosts.slice(startIndex, endIndex);

    return { totalPages, pagenatedTotalPosts };
  }
}
