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
import { InjectRepository } from '@nestjs/typeorm';
import { InviteChallenge } from '../entities/inviteChallenge.entity';
import { Challenge } from '../entities/challenge.entity';

@Injectable()
export class ChallengesService {
  constructor(
    private readonly challengesRepository: ChallengesRepository,
    private readonly challengersRepository: ChallengersRepository,
    private readonly goalsRepository: GoalsRepository,
    private readonly userRepository: UserRepository,
    private readonly followsRepository: FollowsRepository,
    private readonly recordsRepository: RecordsRepository,
    @InjectRepository(InviteChallenge)
    private readonly inviteChallengeRepository: Repository<InviteChallenge>,
    private dataSource: DataSource,
  ) {}

  // 도전 생성 (재용)
  async createChallenge(body: CreateChallengeRequestDto, userId: number) {
    const {
      title,
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

    const startDateObject = new Date(startDate);
    const endDate = new Date();

    endDate.setDate(startDateObject.getDate() + challengeWeek * 7);

    if (endDate.getDate() < startDateObject.getDate()) {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    const challenge = await this.challengesRepository.createChallenge({
      userId,
      title,
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
    await this.userRepository.updateUserIsInChallenge(userId, true);
  }

  // 도전 목록 조회 (상우, 재용)
  async getChallenges() {
    const challenges = await this.challengesRepository.getChallenges();
    return challenges;
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
    if (challengerCount >= 2) {
      throw new BadRequestException('도전에 참여한 회원이 이미 존재합니다.');
    } else if (challenge.startDate <= new Date() && challengerCount >= 2) {
      throw new BadRequestException(
        '도전에 참여한 회원이 이미 존재하며, 도전 시작일이 경과되었습니다.',
      );
    } else if (challenge.endDate <= new Date()) {
      throw new BadRequestException('이미 종료된 도전은 삭제할 수 없습니다.');
    }

    await this.challengesRepository.deleteChallenge(challengeId);
    await this.userRepository.updateUserIsInChallenge(userId, false);
  }

  // 도전 방 입장 (재용)
  // 단순히 입장하는 개념이 아니라, 회원이 처음 입장하는 경우
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

    const isExistingChallenger = await this.challengersRepository.getChallenger(
      challengeId,
      userId,
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

    const user = await this.userRepository.getUserById(userId);
    if (user.isInChallenge === true) {
      throw new BadRequestException(
        '동시에 2개 이상의 도전을 진행할 수 없습니다.',
      );
    }

    if (new Date() > challenge.startDate) {
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
    await this.userRepository.updateUserIsInChallenge(userId, false);
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

    if (new Date() > challenge.startDate) {
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
      challengeId,
      user.id,
    );
    if (challenger.type !== Position.HOST) {
      throw new UnauthorizedException('방장만 다른 회원을 초대할 수 있습니다.');
    }

    const { email } = body;
    if (!email) {
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

    const newInvite = new InviteChallenge();
    newInvite.userId = user.id;
    newInvite.invitedId = invitedUser.id;
    newInvite.message = message;
    newInvite.name = user.name;
    const newInviteResult = await this.inviteChallengeRepository.save(
      newInvite,
    );

    return newInviteResult;
  }

  // 나에게 온 도전 초대 목록 조회
  async getInvitedChallenges(invitedId) {
    const challengeInvities = await this.inviteChallengeRepository.find({
      where: { invitedId, done: false },
    });
    if (!challengeInvities || challengeInvities.length <= 0) {
      throw new NotFoundException('데이터가 존재하지 않습니다.');
    }

    return challengeInvities;
  }

  // 도전 초대 수락
  async acceptChallenge(
    userId: number, // 초대한 사람
    body: ResponseChallengeDto,
    invitedId: number, // 초대받은 사람 (현재 접속중인 회원)
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    if (body.response === 'yes') {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const invitedChallenge = await queryRunner.manager.findOne(
          InviteChallenge,
          {
            where: { userId, invitedId },
          },
        );

        invitedChallenge.done = true;

        const newChallenger = await queryRunner.manager.create(
          InviteChallenge,
          {
            userId,
            invitedId,
          },
        );

        await this.inviteChallengeRepository.save(invitedChallenge);
        await this.challengersRepository.save(newChallenger);
        await queryRunner.commitTransaction();
        return;
      } catch (e) {
        await queryRunner.rollbackTransaction();
        throw e;
      } finally {
        await queryRunner.release();
      }
    }

    await this.inviteChallengeRepository.update(
      { userId, invitedId },
      { done: true },
    );
  }

  // 유저 도전목록수 + 도전목록조회
  async getUserChallenges(userId: number): Promise<[Challenge[], number]> {
    return this.challengesRepository.getUserChallenges(userId);
  }
}
