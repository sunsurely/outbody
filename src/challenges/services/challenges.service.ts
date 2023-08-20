import { UserRepository } from 'src/users/repositories/users.repository';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  NotImplementedException,
} from '@nestjs/common';
import { ChallengesRepository } from '../repositories/challenges.repository';
import { CreateChallengeRequestDto } from '../dto/create-challenge.request.dto';
import { InviteChallengeDto } from '../dto/invite-challenge.dto';

@Injectable()
export class ChallengesService {
  constructor(
    private readonly challengesRepository: ChallengesRepository,
    private readonly UserRepository: UserRepository,
  ) {}

  // 도전 생성
  async createChallenge(body: CreateChallengeRequestDto) {
    const {
      title,
      imgUrl,
      startDate,
      challengeWeek,
      userNumberLimit,
      publicView,
      description,
      hostPoint,
      entryPoint,
    } = body;

    const startDateObject = new Date(startDate);

    const endDateObject = new Date(startDateObject);
    endDateObject.setDate(startDateObject.getDate() + challengeWeek * 7);

    const endDate = endDateObject.toISOString();
    console.log(endDate);

    await this.challengesRepository.createChallenge({
      title,
      imgUrl,
      startDate,
      challengeWeek,
      endDate,
      userNumberLimit,
      publicView,
      description,
      hostPoint,
      entryPoint,
    });
  }

  // 도전그룹 목록조회
  async getChallenges() {
    const challenges = await this.challengesRepository.getChallenges();
    return challenges;
  }

  // 도전그룹 상세조회
  async getChallenge(challengeId: number) {
    const challenge = await this.challengesRepository.getChallenge(challengeId);
    if (!challenge) {
      throw new NotFoundException('해당 도전 게시글이 조회되지 않습니다.');
    }
    return challenge;
  }

  // 도전 삭제
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

    if (myChallenge.userNumberLimit >= 2) {
      throw new BadRequestException('도전에 참여한 회원이 이미 존재합니다.');
    } else if (startDate <= today && myChallenge.userNumberLimit >= 2) {
      throw new BadRequestException(
        '도전에 참여한 회원이 이미 존재하며, 도전 시작일이 경과되었습니다.',
      );
    } else if (endDate <= today) {
      throw new BadRequestException('이미 종료된 도전입니다.');
    }
    return await this.challengesRepository.deleteChallenge(challengeId);
  }

  // 도전 친구초대
  async inviteChallenge(challengeId: number, body: InviteChallengeDto) {
    const { email } = body;
    if (!email || email == undefined) {
      throw new BadRequestException(
        '도전에 초대할 친구 이메일을 입력해주세요.',
      );
    }

    const invitedUser = await this.UserRepository.getUserByEmail(email);
    if (!invitedUser || invitedUser == undefined) {
      throw new NotFoundException('초대하려는 사용자를 찾을 수 없습니다.');
    }

    await this.challengesRepository.inviteChallenge(challengeId, invitedUser);
  }
}
