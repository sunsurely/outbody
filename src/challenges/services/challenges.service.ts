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
import { cache } from '../cache/challenges.cache';
import { RecordsRepository } from 'src/records/repositories/records.repository';

@Injectable()
export class ChallengesService {
  constructor(
    private readonly challengesRepository: ChallengesRepository,
    private readonly goalsRepository: GoalsRepository,
    private readonly challengersRepository: ChallengersRepository,
    private readonly userRepository: UserRepository,
    private readonly followsRepository: FollowsRepository,
    private readonly recordsRepository: RecordsRepository,
  ) {}

  // 도전 생성 (재용)
  async createChallenge(body: CreateChallengeRequestDto, userId: number) {
    const {
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

    const isExistingChallenger =
      await this.challengersRepository.getChallengerByUserId(userId);

    if (isExistingChallenger) {
      throw new BadRequestException(
        '동시에 2개 이상의 도전을 생성할 수 없습니다.',
      );
    }

    const entryPoint =
      attend * Point.ATTEND +
      weight * Point.WEIGHT +
      muscle * Point.MUSCLE +
      fat * Point.FAT;

    const startDateObject = new Date(startDate);
    const endDate = new Date();
    endDate.setDate(startDateObject.getDate() + challengeWeek * 7);

    const challenge = await this.challengesRepository.createChallenge({
      userId,
      title,
      imgUrl,
      startDate: startDateObject,
      challengeWeek,
      endDate,
      userNumberLimit,
      publicView,
      description,
      entryPoint,
      isDistributed: false,
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
      type: Position.HOST,
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
        entryPoint: challenge.entryPoint,
        isDistribute: challenge.isDistributed,
      };
    });
  }

  // 도전 상세조회 (상우)
  async getChallenge(challengeId: number) {
    const challenge = await this.challengesRepository.getChallenge(challengeId);
    if (!challenge) {
      throw new NotFoundException('해당 도전이 조회되지 않습니다.');
    }
    return challenge;
  }

  // 도전 삭제 (상우, 재용)
  async deleteChallenge(challengeId: number, userId: number) {
    const challenge = await this.challengesRepository.getChallenge(challengeId);

    if (!challenge) {
      throw new NotFoundException('해당 도전이 조회되지 않습니다.');
    }

    if (challenge.userId !== userId) {
      throw new UnauthorizedException(
        '본인이 생성한 도전만 삭제가 가능합니다.',
      );
    }

    const challengerCount = await this.challengersRepository.getChallengerCount(
      challengeId,
    );

    const today = new Date();

    if (challengerCount >= 2) {
      throw new BadRequestException('도전에 참여한 회원이 이미 존재합니다.');
    } else if (challenge.startDate <= today && challengerCount >= 2) {
      throw new BadRequestException(
        '도전에 참여한 회원이 이미 존재하며, 도전 시작일이 경과되었습니다.',
      );
    } else if (challenge.endDate <= today) {
      throw new BadRequestException('이미 종료된 도전은 삭제할 수 없습니다.');
    }
    return await this.challengesRepository.deleteChallenge(challengeId);
  }

  // 도전 방 입장 (재용)
  async joinChallenge(challengeId: number, userId: number) {
    const challenge = await this.challengesRepository.getChallenge(challengeId);

    if (!challenge) {
      throw new NotFoundException('해당 도전이 조회되지 않습니다.');
    }

    if (challenge.publicView === false) {
      throw new BadRequestException(
        '비공개 도전은 초대를 받은 회원만 참여가 가능합니다.',
      );
    }

    const challengerCount = await this.challengersRepository.getChallengerCount(
      challengeId,
    );

    if (challenge.userNumberLimit <= challengerCount) {
      throw new BadRequestException(
        '참가자 수 초과로 인해, 도전에 참가할 수 없습니다.',
      );
    }

    const isExistingChallenger =
      await this.challengersRepository.getChallengerByUserId(userId);

    if (isExistingChallenger) {
      throw new BadRequestException(
        '동시에 2개 이상의 도전을 진행할 수 없습니다.',
      );
    }

    const user = await this.userRepository.getUserById(userId);
    if (user.point < challenge.entryPoint) {
      throw new BadRequestException(
        '현재 가지고 있는 점수가 입장 점수보다 낮아서, 도전에 참가할 수 없습니다.',
      );
    }

    if (new Date() > challenge.startDate) {
      throw new BadRequestException('이미 시작된 도전에는 참가할 수 없습니다.');
    }

    const goal = await this.goalsRepository.getGoal(challengeId);

    if (goal.weight || goal.muscle || goal.fat) {
      const latestUserRecord = await this.recordsRepository.getLatestUserRecord(
        userId,
      );

      const startDateObject = new Date(challenge.startDate);

      const timeDifference =
        startDateObject.getTime() - latestUserRecord.createdAt.getTime();
      const dayDifference = timeDifference / (1000 * 60 * 60 * 24);

      if (dayDifference > 7) {
        throw new BadRequestException(
          '체성분 인증이 필요한 도전의 경우, 도전 시작일 기준 7일 이내의 측정 기록이 필요합니다.',
        );
      }
    }

    await this.challengersRepository.createChallenger({
      userId,
      challengeId: challenge.id,
      type: Position.GUEST,
      done: false,
    });
  }

  // 도전 방 퇴장 (상우, 재용)
  async leaveChallenge(challengeId: number, userId: number) {
    const challenge = await this.challengesRepository.getChallenge(challengeId);

    if (!challenge) {
      throw new NotFoundException('해당 도전이 조회되지 않습니다.');
    }

    const today = new Date();

    const user = await this.userRepository.getUserById(userId);

    if (challenge.startDate <= today) {
      user.point = user.point - challenge.entryPoint;
      const updateUserPoint = user.point;
      await this.userRepository.updateUserPoint(userId, updateUserPoint);
    }

    await this.challengersRepository.deleteChallenger(challenge.id, userId);
  }

  // 도전 친구 초대 (상우)
  async inviteChallenge(
    challengeId: number,
    body: InviteChallengeDto,
    userId: number,
  ) {
    const challenge = await this.challengesRepository.getChallenge(challengeId);

    if (!challenge) {
      throw new NotFoundException('해당 도전이 조회되지 않습니다.');
    }

    const challengerCount = await this.challengersRepository.getChallengerCount(
      challengeId,
    );

    if (challenge.userNumberLimit <= challengerCount) {
      throw new BadRequestException(
        '참가자 수 초과로 인해, 도전에 초대할 수 없습니다.',
      );
    }

    const challenger = await this.challengersRepository.getChallenger(
      challengeId,
    );
    if (challenger.type !== Position.HOST) {
      throw new UnauthorizedException('방장만 다른 회원을 초대할 수 있습니다.');
    }

    const { email } = body;
    if (!email || email == undefined) {
      throw new BadRequestException(
        '도전에 초대할 친구의 계정(e-mail)을 입력해주세요.',
      );
    }

    const invitedUser = await this.userRepository.getUserByEmail(email);
    if (!invitedUser || invitedUser == undefined) {
      throw new NotFoundException('초대하려는 회원을 찾을 수 없습니다.');
    }

    const isFriend = await this.followsRepository.getFollowById(
      invitedUser.id,
      userId,
    );

    if (!isFriend) {
      throw new NotFoundException(
        '해당 회원은 친구가 아니므로 초대할 수 없습니다.',
      );
    }

    // 초대된 참가자가 이미 참가한 도전자인지 확인
    const isExistingChallenger = await this.challengersRepository.getChallenger(
      challengeId,
    );
    if (isExistingChallenger.userId == invitedUser.id) {
      throw new BadRequestException('이미 도전에 참가한 회원입니다.');
    }

    const message =
      '도전에 참가하시겠습니까? (해당 초대는 24시간 동안 유효합니다.)';
    // 초대문만 넣어서는 처리가 안됨. 배열로 저장, 초대정보를 담아야 함

    const invitation = cache.set(
      `invitation_${challengeId}_${invitedUser.id}`,
      message,
    );

    console.log('초대 요청', invitation);
  }

  // 도전 초대 수락 (상우)
  async acceptChallenge(
    challengeId: number,
    body: ResponseChallengeDto,
    userId: number,
  ) {
    const invitation = cache.get(`invitation_${challengeId}_${userId}`);

    console.log('초대 수락', invitation);

    if (!invitation) {
      throw new NotFoundException('새로운 초대가 없습니다.');
    }

    const challenge = await this.challengesRepository.getChallenge(challengeId);

    if (!challenge) {
      throw new NotFoundException('해당 도전이 조회되지 않습니다.');
    } else if (!body) {
      throw new BadRequestException(
        '초대 수락 답변의 형식이 올바르지 않습니다.',
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
