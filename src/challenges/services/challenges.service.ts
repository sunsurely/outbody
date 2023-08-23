import { FollowsRepository } from './../../follows/repositories/follows.repository';
import { UserRepository } from 'src/users/repositories/users.repository';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ChallengesRepository } from '../repositories/challenges.repository';
import { CreateChallengeRequestDto } from '../dto/create-challenge.request.dto';
import { InviteChallengeDto } from '../dto/invite-challenge.dto';
import { GoalsRepository } from '../repositories/goals.repository';
import { ChallengersRepository } from '../repositories/challengers.repository';
import { Point, Position } from '../challengerInfo';
import { ResponseChallengeDto } from '../dto/response-challenge.dto';

@Injectable()
export class ChallengesService {
  constructor(
    private readonly challengesRepository: ChallengesRepository,
    private readonly goalsRepository: GoalsRepository,
    private readonly challengersRepository: ChallengersRepository,
    private readonly userRepository: UserRepository,
    private readonly followsRepository: FollowsRepository,
  ) {}

  // 도전 생성 (재용)
  async createChallenge(body: CreateChallengeRequestDto, userId: number) {
    const {
      type,
      title,
      imgUrl,
      startDate,
      challengeWeek,
      userNumberLimit,
      publicView,
      description,
      attend,
      weight,
      muscle,
      fat,
    } = body;

    const totalPoint =
      attend * Point.ATTEND +
      weight * Point.WEIGHT +
      muscle * Point.MUSCLE +
      fat * Point.FAT;

    const startDateObject = new Date(startDate);
    const endDateObject = new Date(startDateObject);
    endDateObject.setDate(startDateObject.getDate() + challengeWeek * 7);
    const endDate = endDateObject.toISOString();

    const challenge = await this.challengesRepository.createChallenge({
      userId,
      title,
      imgUrl,
      startDate,
      challengeWeek,
      endDate,
      userNumberLimit,
      publicView,
      description,
      totalPoint,
    });

    await this.goalsRepository.createGoal({
      challengeId: challenge.id,
      attend,
      weight,
      muscle,
      fat,
    });

    await this.challengersRepository.createChallenger({
      userId,
      challengeId: challenge.id,
      type,
      done: false,
    });
  }

  // 도전자 목록조회 (재용)
  async getChallengers(challengeId) {
    const challengers = await this.challengersRepository.getChallengers(
      challengeId,
    );
    return challengers;
  }

  // 도전 목록조회 (상우, 재용)
  async getChallenges() {
    const challenges = await this.challengesRepository.getChallenges();
    return challenges.map((challenge) => {
      return {
        id: challenge.id,
        title: challenge.title,
        imgUrl: challenge.imgUrl,
        startDate: challenge.startDate,
        endDate: challenge.endDate,
        userNumberLimit: challenge.userNumberLimit,
        publicView: challenge.publicView,
        totalPoint: challenge.totalPoint,
      };
    });
  }

  // 도전 상세조회 (상우)
  async getChallenge(challengeId: number) {
    const challenge = await this.challengesRepository.getChallenge(challengeId);
    if (!challenge) {
      throw new NotFoundException('해당 도전 게시글이 조회되지 않습니다.');
    }
    return challenge;
  }

  // 도전 삭제 (상우, 재용)
  async deleteChallenge(challengeId: number) {
    const myChallenge = await this.challengesRepository.getChallenge(
      challengeId,
    );

    if (!myChallenge) {
      throw new NotFoundException('해당 도전 게시글이 조회되지 않습니다.');
    }

    const startDate = new Date(myChallenge.startDate);
    const endDate = new Date(myChallenge.endDate);
    const today = new Date();

    const challengerCount = await this.challengersRepository.getChallengerCount(
      challengeId,
    );

    if (challengerCount >= 2) {
      throw new BadRequestException('도전에 참여한 회원이 이미 존재합니다.');
    } else if (startDate <= today && challengerCount >= 2) {
      throw new BadRequestException(
        '도전에 참여한 회원이 이미 존재하며, 도전 시작일이 경과되었습니다.',
      );
    } else if (endDate <= today) {
      throw new BadRequestException('이미 종료된 도전입니다.');
    }
    return await this.challengesRepository.deleteChallenge(challengeId);
  }

  // 도전 방 입장 (재용)
  async joinChallenge(challengeId: number, type: Position, userId: number) {
    const challenge = await this.challengesRepository.getChallenge(challengeId);

    if (!challenge) {
      throw new NotFoundException('해당 도전 게시글이 조회되지 않습니다.');
    }

    const isExistingChallenger =
      await this.challengersRepository.getChallengerByUserId(userId);

    if (isExistingChallenger) {
      throw new BadRequestException(
        '동시에 2개 이상의 도전을 진행할 수 없습니다.',
      );
    }

    const user = await this.userRepository.getUserById(userId);
    if (user.point < challenge.totalPoint) {
      throw new BadRequestException(
        '현재 가지고 있는 점수가 입장 점수보다 낮아서, 도전에 참가할 수 없습니다.',
      );
    }

    const startDate = new Date(challenge.startDate);
    const today = new Date();

    if (today > startDate) {
      throw new BadRequestException('이미 시작된 도전에는 참가할 수 없습니다.');
    }

    await this.challengersRepository.createChallenger({
      userId,
      challengeId: challenge.id,
      type,
      done: false,
    });
  }

  // 도전 방 퇴장 (상우)
  async leaveChallenge(challengeId: number, userId: number) {
    const challenge = await this.challengesRepository.getChallenge(challengeId);
    if (!challenge) {
      throw new NotFoundException('해당 도전 게시글이 조회되지 않습니다.');
    }
    await this.challengersRepository.deleteChallenger(challenge.id, userId);
  }

  // 도전 친구초대 (상우)
  async inviteChallenge(
    challengeId: number,
    body: InviteChallengeDto,
    userId: number,
  ) {
    const challenge = await this.challengesRepository.getChallenge(challengeId);
    if (!challenge) {
      throw new NotFoundException('도전 게시글을 찾을 수 없습니다.');
    }

    const { email } = body;
    if (!email || email == undefined) {
      throw new BadRequestException(
        '도전에 초대할 친구 이메일을 입력해주세요.',
      );
    }

    const invitedUser = await this.userRepository.getUserByEmail(email);
    if (!invitedUser || invitedUser == undefined) {
      throw new NotFoundException('초대하려는 사용자를 찾을 수 없습니다.');
    }

    const friend = await this.followsRepository.getFollowById(
      invitedUser.id,
      userId,
    );
    console.log('userId', userId);
    console.log('invitedUser.id', invitedUser.id);
    if (!friend || friend == undefined) {
      throw new NotFoundException('친구가 조회되지 않습니다.');
    }

    // 초대된 참가자가 이미 참가한 도전자인지 확인
    const existingChallenger = await this.challengersRepository.getChallenger(
      challengeId,
    );
    if (existingChallenger.userId == invitedUser.id) {
      throw new BadRequestException('이미 도전에 참가한 회원입니다.');
    }
    await this.challengesRepository.inviteChallenge(challengeId, friend);
  }

  // 도전 초대수락
  async acceptChallenge(
    challengeId: number,
    body: ResponseChallengeDto,
    userId: number,
  ) {
    const challenge = await this.challengesRepository.getChallenge(challengeId);
    if (!challenge) {
      throw new NotFoundException('해당 도전 게시글이 조회되지 않습니다.');
    } else if (!body) {
      throw new BadRequestException(
        '도전방 초대 수락 여부를 `yes`또는 `no`로 작성해주세요.',
      );
    }

    if (body.response !== 'yes') {
      throw new UnauthorizedException('초대 수락을 거절했습니다.');
    }

    await this.challengersRepository.createChallenger({
      userId,
      challengeId: challenge.id,
      type: Position.INVITED,
      done: false,
    });
  }
}
