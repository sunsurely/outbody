import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ChallengesRepository } from '../repositories/challenges.repository';
import { ChallengersRepository } from '../repositories/challengers.repository';
import { GoalsRepository } from '../repositories/goals.repository';
import { UserRepository } from 'src/users/repositories/users.repository';
import { RecordsRepository } from 'src/records/repositories/records.repository';
import { FollowsRepository } from './../../follows/repositories/follows.repository';
import { CreateChallengeRequestDto } from '../dto/create-challenge.request.dto';
import { InviteChallengeDto } from '../dto/invite-challenge.dto';
import { ResponseChallengeDto } from '../dto/response-challenge.dto';
import { Point, Position } from '../challengerInfo';
import { User } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { InviteChallengesRepository } from '../repositories/inviteChalleges.repository';
import { Challenge } from '../entities/challenge.entity';
import { Notification } from '../entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChallengesService {
  constructor(
    private readonly challengesRepository: ChallengesRepository,
    private readonly challengersRepository: ChallengersRepository,
    private readonly goalsRepository: GoalsRepository,
    private readonly userRepository: UserRepository,
    private readonly followsRepository: FollowsRepository,
    private readonly recordsRepository: RecordsRepository,
    private readonly inviteChallengesRepository: InviteChallengesRepository,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private dataSource: DataSource,
  ) {}

  // 도전 생성
  async createChallenge(body: CreateChallengeRequestDto, userId: number) {
    const {
      title,
      startDate,
      endDate,
      challengeWeek,
      userNumberLimit,
      publicView,
      description,
      attend,
      weight,
      muscle,
      fat,
    } = body;

    const user = await this.userRepository.getUserById(userId);
    if (user.isInChallenge === true) {
      throw new BadRequestException(
        '동시에 2개 이상의 도전을 진행할 수 없습니다.',
      );
    }

    const entryPoint =
      attend * Point.ATTEND * challengeWeek +
      weight * Point.WEIGHT +
      muscle * Point.MUSCLE +
      fat * Point.FAT;

    const challenge = await this.challengesRepository.createChallenge({
      userId,
      title,
      startDate,
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
    await this.userRepository.updateUserIsInChallenge(userId, true);
  }

  // 도전 목록 조회
  async getChallenges(filteredWith: string, user: User, page: number) {
    // case 1 //
    if (filteredWith === 'all') {
      const totalCount: number =
        await this.challengesRepository.getAllChallengesCount();
      const allChallenges: Challenge[] =
        await this.challengesRepository.getAllChallenges(page);

      const totalPages: number = Math.ceil(totalCount / 10);
      const challenges = await this.mapChallenges(allChallenges);

      return { totalPages, challenges };
      // case 2 //
      // condition: startDate, publicView, entrypoint, userNumberLimit
    } else if (filteredWith === 'possible') {
      const currentUser = await this.userRepository.getUserById(user.id);

      const totalCount: number =
        await this.challengesRepository.getPossibleChallengesCount(
          currentUser.point,
        );
      const possibleChallenges: Challenge[] =
        await this.challengesRepository.getPossibleChallenges(
          page,
          currentUser.point,
        );

      const filteredChallenges: Challenge[] = possibleChallenges.filter(
        async (challenge) => {
          const userNumber: number =
            await this.challengersRepository.getChallengerCount(challenge.id);
          return challenge.userNumberLimit > userNumber;
        },
      );

      const totalPages: number = Math.ceil(totalCount / 10);
      const challenges = await this.mapChallenges(filteredChallenges);

      return { totalPages, challenges };
      // case 3 //
    } else if (filteredWith === 'my') {
      const totalCount: number =
        await this.challengesRepository.getMyChallengesCount(user.id);
      const myChallenges: Challenge[] =
        await this.challengesRepository.getMyChallenges(page, user.id);

      const totalPages: number = Math.ceil(totalCount / 10);
      const challenges = await this.mapChallenges(myChallenges);

      return { totalPages, challenges };
    }
  }

  // 도전 목록 가공 함수
  async mapChallenges(challenges) {
    const result = challenges.map(async (challenge) => {
      const goal = await this.goalsRepository.getGoal(challenge.id);
      const user = await this.userRepository.getUserById(challenge.userId);
      const userNumber = await this.challengersRepository.getChallengerCount(
        challenge.id,
      );

      const challengeObject = {
        id: challenge.id,
        title: challenge.title,
        startDate: challenge.startDate,
        endDate: challenge.endDate,
        challengeWeek: challenge.challengeWeek,
        userNumber: userNumber,
        userNumberLimit: challenge.userNumberLimit,
        publicView: challenge.publicView,
        entryPoint: challenge.entryPoint,
        goalAttend: goal.attend,
        goalWeight: goal.weight,
        goalMuscle: goal.muscle,
        goalFat: goal.fat,
        hostName: user.name,
        hostImageUrl: user.imgUrl,
      };
      return challengeObject;
    });
    return Promise.all(result);
  }

  // 도전자 목록 조회
  async getChallengers(challengeId: number) {
    const challengers = await this.challengersRepository.getChallengers(
      challengeId,
    );
    return challengers;
  }

  // 도전 상세 조회
  async getChallenge(challengeId: number) {
    const challenge = await this.challengesRepository.getChallenge(challengeId);
    if (!challenge) {
      throw new NotFoundException('해당 도전이 조회되지 않습니다.');
    }

    const goal = await this.goalsRepository.getGoal(challenge.id);
    const user = await this.userRepository.getUserById(challenge.userId);
    const userNumber = await this.challengersRepository.getChallengerCount(
      challengeId,
    );

    const challengeObject = {
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      startDate: challenge.startDate,
      endDate: challenge.endDate,
      userNumber: userNumber,
      userNumberLimit: challenge.userNumberLimit,
      entryPoint: challenge.entryPoint,
      goalAttend: goal.attend,
      goalWeight: goal.weight,
      goalMuscle: goal.muscle,
      goalFat: goal.fat,
      userName: user.name,
      userPoint: user.point,
      userImageUrl: user.imgUrl,
    };
    return challengeObject;
  }

  // 도전 삭제
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
    if (challengerCount >= 2) {
      throw new BadRequestException('도전에 참여한 회원이 이미 존재합니다.');
    } else if (
      new Date(challenge.startDate) <= new Date() &&
      challengerCount >= 2
    ) {
      throw new BadRequestException(
        '도전에 참여한 회원이 이미 존재하며, 도전 시작일이 경과되었습니다.',
      );
    } else if (new Date(challenge.endDate) <= new Date()) {
      throw new BadRequestException('이미 종료된 도전은 삭제할 수 없습니다.');
    }

    await this.challengesRepository.deleteChallenge(challengeId);
    await this.userRepository.updateUserIsInChallenge(userId, false);
  }

  // 도전 방 입장 (재용)
  // 단순히 입장하는 개념이 아니라, 회원이 처음 입장하는 경우
  async joinChallenge(challengeId: number, currentUser: User) {
    const challenge = await this.challengesRepository.getChallenge(challengeId);
    if (!challenge) {
      throw new NotFoundException('해당 도전이 조회되지 않습니다.');
    }

    if (challenge.publicView === false) {
      throw new BadRequestException(
        '비공개 도전은 초대를 받은 회원만 참여가 가능합니다.',
      );
    }

    const isExistingChallenger = await this.challengersRepository.getChallenger(
      challengeId,
      currentUser.id,
    );
    if (isExistingChallenger) {
      throw new BadRequestException('현재 참여 중인 도전입니다.');
    }

    const challengerCount = await this.challengersRepository.getChallengerCount(
      challengeId,
    );
    if (challenge.userNumberLimit <= challengerCount) {
      throw new BadRequestException(
        '참가자 수 초과로 인해, 도전에 참가할 수 없습니다.',
      );
    }

    const user = await this.userRepository.getUserById(currentUser.id);
    if (user.isInChallenge === true) {
      throw new BadRequestException(
        '동시에 2개 이상의 도전을 진행할 수 없습니다.',
      );
    }

    if (new Date() >= new Date(challenge.startDate)) {
      throw new BadRequestException('이미 시작된 도전에는 참가할 수 없습니다.');
    }

    if (user.point < challenge.entryPoint) {
      throw new BadRequestException(
        '현재 가지고 있는 점수가 입장 점수보다 낮아서, 도전에 참가할 수 없습니다.',
      );
    }

    const goal = await this.goalsRepository.getGoal(challengeId);
    if (goal.weight !== 0 || goal.muscle !== 0 || goal.fat !== 0) {
      const latestUserRecord = await this.recordsRepository.getLatestUserRecord(
        currentUser.id,
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
      userId: currentUser.id,
      challengeId: challenge.id,
      type: Position.GUEST,
      done: false,
    });
    await this.userRepository.updateUserIsInChallenge(currentUser.id, true);
  }

  // 도전 방 퇴장
  async leaveChallenge(challengeId: number, currentUser: User) {
    const challenge = await this.challengesRepository.getChallenge(challengeId);
    if (!challenge) {
      throw new NotFoundException('해당 도전이 조회되지 않습니다.');
    }

    const challenger = await this.challengersRepository.getChallenger(
      challengeId,
      currentUser.id,
    );
    if (!challenger) {
      throw new BadRequestException('현재 참여 중인 도전이 아닙니다.');
    }
    if (challenger.type === Position.HOST) {
      throw new BadRequestException(
        '본인이 생성한 도전은 퇴장이 불가능합니다.',
      );
    }

    if (new Date(challenge.endDate) <= new Date()) {
      throw new BadRequestException('이미 종료된 도전은 퇴장이 불가능합니다.');
    }

    const user = await this.userRepository.getUserById(currentUser.id);

    // 도전 시작일이 경과한 이후에 방에서 퇴장하는 경우, 점수 차감
    if (new Date(challenge.startDate) <= new Date()) {
      user.point = user.point - challenge.entryPoint;
      const updateUserPoint = user.point;

      await this.userRepository.updateUserPoint(
        currentUser.id,
        updateUserPoint,
      );
    }

    await this.challengersRepository.deleteChallenger(
      challenge.id,
      currentUser.id,
    );
    await this.userRepository.updateUserIsInChallenge(currentUser.id, false);
  }

  // 도전 친구 초대
  async inviteChallenge(
    challengeId: number,
    body: InviteChallengeDto,
    user: User,
  ) {
    const challenge = await this.challengesRepository.getChallenge(challengeId);
    if (!challenge) {
      throw new NotFoundException('해당 도전이 조회되지 않습니다.');
    }

    if (new Date() > new Date(challenge.startDate)) {
      throw new BadRequestException('이미 시작된 도전에는 초대할 수 없습니다.');
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
      challenge.id,
      user.id,
    );
    if (!challenger || challenger.type !== Position.HOST) {
      throw new UnauthorizedException('방장만 다른 회원을 초대할 수 있습니다.');
    }

    const { email } = body;
    if (!email) {
      throw new BadRequestException(
        '도전에 초대할 친구의 계정(e-mail)을 입력해주세요.',
      );
    }

    const invitedUser = await this.userRepository.getUserByEmail(email);
    if (!invitedUser) {
      throw new NotFoundException('초대하려는 회원을 찾을 수 없습니다.');
    }

    const isFriend = await this.followsRepository.getFollowById(
      invitedUser.id,
      user.id,
    );

    if (!isFriend) {
      throw new NotFoundException(
        '해당 회원은 친구가 아니므로 초대할 수 없습니다.',
      );
    }

    if (invitedUser.isInChallenge === true) {
      throw new BadRequestException('현재 다른 도전에 참가 중인 회원입니다.');
    }

    const isExistingChallenger = await this.challengersRepository.getChallenger(
      challengeId,
      invitedUser.id,
    );
    if (isExistingChallenger) {
      throw new BadRequestException('이미 도전에 참가한 회원입니다.');
    }

    const message = `${user.name}(${user.email})님이 회원님을 도전에 초대했습니다. 참가하시겠습니까?`;

    const newInvitation =
      await this.inviteChallengesRepository.createInvitation({
        userId: user.id,
        invitedId: invitedUser.id,
        email: user.email,
        message,
        name: user.name,
        challengeId,
        imgUrl: user.imgUrl,
      });
    return newInvitation;
  }

  // 나에게 온 도전 초대 목록 조회
  async getInvitedChallenges(invitedUser: User) {
    const challengeInvitations =
      await this.inviteChallengesRepository.getInvitations(invitedUser.id);
    if (!challengeInvitations || challengeInvitations.length <= 0) {
      throw new NotFoundException(
        '나에게 온 도전 초대 목록이 존재하지 않습니다.',
      );
    }
    return challengeInvitations;
  }

  // 도전 초대 수락
  async acceptChallenge(
    userId: number, // 초대한 사람
    body: ResponseChallengeDto,
    invitedUser: User, // 초대받은 사람 (현재 접속중인 회원)
  ) {
    if (body.response === 'yes') {
      const userWhoInvite =
        await this.challengersRepository.getChallengerWithUserId(userId);

      await this.joinChallenge(userWhoInvite.challengeId, invitedUser);
    }

    await this.inviteChallengesRepository.deleteInvitation(
      userId,
      invitedUser.id,
    );
  }

  // 유저 도전목록수 + 도전목록조회
  async getUserChallenges(userId: number): Promise<Challenge[]> {
    const userChallengerIds = await this.challengersRepository.find({
      select: ['challengeId'],
      where: { userId },
    });

    const userChallengeIds = userChallengerIds.map(
      (challenger) => challenger.challengeId,
    );

    const userChallenges = await this.challengesRepository
      .createQueryBuilder('challenge')
      .whereInIds(userChallengeIds)
      .select([
        'challenge.title',
        'challenge.startDate',
        'challenge.endDate',
        'challenge.challengeWeek',
        'challenge.description',
      ])
      .orderBy('challenge.createdAt', 'DESC')
      .getMany();

    return userChallenges;
  }

  async getChallengeLogs(userId: number) {
    const logs = await this.notificationRepository.find({ where: { userId } });
    if (!logs || logs.length <= 0) {
      throw new NotFoundException('챌린지 로그가 존재하지 않습니다.');
    }

    return logs;
  }
}
