import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  Logger,
  NotImplementedException,
} from '@nestjs/common';
import { ChallengesRepository } from '../repositories/challenges.repository';
import { ChallengersRepository } from '../repositories/challengers.repository';
import { GoalsRepository } from '../repositories/goals.repository';
import { UserRepository } from 'src/users/repositories/users.repository';
import { RecordsRepository } from 'src/records/repositories/records.repository';
import { FollowsRepository } from './../../follows/repositories/follows.repository';
import { CreateChallengeRequestDto } from '../dto/create-challenge.request.dto';
import { CreateChallengerDto } from '../dto/create-challengers.dto';
import { InviteChallengeDto } from '../dto/invite-challenge.dto';
import { ResponseChallengeDto } from '../dto/response-challenge.dto';
import { Invitiation, Point, Position } from '../challengerInfo';
import { cache } from '../cache/challenges.cache';

@Injectable()
export class ChallengesService {
  constructor(
    private readonly challengesRepository: ChallengesRepository,
    private readonly challengersRepository: ChallengersRepository,
    private readonly goalsRepository: GoalsRepository,
    private readonly userRepository: UserRepository,
    private readonly followsRepository: FollowsRepository,
    private readonly recordsRepository: RecordsRepository,
    private readonly logger: Logger,
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

    // isInChallenge: false => true
    await this.userRepository.updateUserIsInChallenge(userId, true);
  }

  // 도전 목록 조회 (상우, 재용)
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

  // 도전 상세 조회 (상우)
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

    await this.challengesRepository.deleteChallenge(challengeId);

    // isInChallenge: true => false
    await this.userRepository.updateUserIsInChallenge(userId, false);
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

    const isExistingChallenger = await this.challengersRepository.getChallenger(
      challengeId,
      userId,
    );
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

      if (!latestUserRecord) {
        throw new NotFoundException('측정 기록이 존재하지 않습니다.');
      }

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

    // isInChallenge: false => true
    await this.userRepository.updateUserIsInChallenge(userId, true);
  }

  // 도전 방 퇴장 (상우, 재용)
  async leaveChallenge(challengeId: number, userId: number) {
    const challenge = await this.challengesRepository.getChallenge(challengeId);

    if (!challenge) {
      throw new NotFoundException('해당 도전이 조회되지 않습니다.');
    }

    const challenger = await this.challengersRepository.getChallenger(
      challengeId,
      userId,
    );

    if (challenger.type === Position.HOST) {
      throw new BadRequestException(
        '본인이 생성한 도전은 퇴장이 불가능합니다.',
      );
    }

    if (challenge.endDate <= new Date()) {
      throw new BadRequestException('이미 종료된 도전은 퇴장이 불가능합니다.');
    }

    const user = await this.userRepository.getUserById(userId);

    // 도전 시작일이 경과한 이후에 방에서 퇴장하는 경우, 점수 차감
    if (challenge.startDate <= new Date()) {
      user.point = user.point - challenge.entryPoint;
      const updateUserPoint = user.point;
      await this.userRepository.updateUserPoint(userId, updateUserPoint);
    }

    await this.challengersRepository.deleteChallenger(challenge.id, userId);

    // isInChallenge: true => false
    await this.userRepository.updateUserIsInChallenge(userId, false);
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
      userId,
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
      userId,
    );
    if (isExistingChallenger.userId == invitedUser.id) {
      throw new BadRequestException('이미 도전에 참가한 회원입니다.');
    }

    const message =
      '도전에 참가하시겠습니까? (해당 초대는 24시간 동안 유효합니다.)';

    const newInvite: Invitiation = {
      userId,
      invitedUserId: invitedUser.id,
      message,
      challengeId,
    };
    const cachedInvities: Invitiation[] = cache.get(`invite_${invitedUser.id}`);

    if (cachedInvities) {
      const newCachedInvites = cachedInvities.push(newInvite);
      const cacheInvite = cache.set(
        `invite_${invitedUser.id}`,
        newCachedInvites,
      );

      if (cacheInvite) {
        this.logger.debug('inviteUser 캐싱 SET 성공');
        return newInvite;
      }
      this.logger.error('invitedUser 캐싱 SET 실패');
      throw new BadRequestException('초대실패');
    }

    const newCachedInvites = cache.set(`invite_${invitedUser.id}`, [newInvite]);

    if (newCachedInvites) {
      this.logger.debug('inviteUser 캐싱 SET 성공');
      return newInvite;
    }
    this.logger.error('invitedUser 캐싱 SET 실패');
    throw new BadRequestException('초대실패');
  }

  //도전 친구초대 전체조회
  async getInvitedChallengies(invitedId) {
    const cachedInvites: Invitiation[] = cache.get(`invite_${invitedId}`);

    if (!cachedInvites || cachedInvites.length <= 0) {
      this.logger.error('Invite 캐시 GET 실패');
      throw new NotFoundException('초대 목록이 없습니다.');
    }

    this.logger.debug('Invite 캐시 Get 성공');
    return cachedInvites;
  }

  // 도전 초대 수락 (상우)
  async acceptChallenge(
    userId: number,
    body: ResponseChallengeDto,
    invitedId: number,
  ) {
    if (body.response === 'no') {
      const usersInvities: Invitiation[] = cache.get(`invite_${invitedId}`);

      if (!usersInvities || usersInvities.length <= 0) {
        this.logger.error('Invite 캐싱 GET 실패');
        throw new NotFoundException('초대 내역이 없습니다.');
      }

      const newUsersInvities = usersInvities.filter(
        (invite) => invite.userId !== userId,
      );

      const cachedInvities = cache.set(`invite_${invitedId}`, newUsersInvities);

      if (!cachedInvities) {
        this.logger.error('Invite 캐싱 SET 실패');
        throw new BadRequestException('해당 작업을 수행하지 못했습니다.');
      }

      this.logger.debug('Invite 캐싱 성공');
      return { message: '초대거부 TEST중' };
    }

    const invitations: Invitiation[] = cache.get(`invite_${invitedId}`);

    if (!invitations || invitations.length <= 0) {
      this.logger.error('invitations');
      throw new NotFoundException('새로운 초대가 없습니다.');
    }
    const usersInvite: Invitiation = invitations.find(
      (invite) => invite.userId === userId,
    );

    if (usersInvite) {
      const challenge = await this.challengesRepository.getChallenge(
        usersInvite.challengeId,
      );

      if (!challenge) {
        throw new NotFoundException('해당 도전이 조회되지 않습니다.');
      }

      const challangerDto: CreateChallengerDto = {
        userId,
        challengeId: usersInvite.challengeId,
        type: Position.INVITED,
        done: false,
      };

      // isInChallenge: false => true
      await this.userRepository.updateUserIsInChallenge(userId, true);

      const newChallenger = await this.challengersRepository.createChallenger(
        challangerDto,
      );
      const newCachedChallenges = invitations.filter(
        (invite) => invite.userId !== userId,
      );

      const cachedResult = cache.set(
        `invite_${invitedId}`,
        newCachedChallenges,
      );

      if (cachedResult) {
        this.logger.debug('Invite 캐싱 SET 성공');
        return newChallenger;
      }
      this.logger.error('Invite 캐싱 SET 실패');
      throw new NotImplementedException('요청한 작업을 수행하지 못했습니다.');
    }
  }
}
