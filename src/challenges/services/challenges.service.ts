import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { CreateChallengeDto } from '../dto/create-challenge.dto';
import { UpdateChallengeDto } from '../dto/update-challenge.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChallengesRepository } from '../repositories/challenges.repository';
import { Challenge } from '../entities/challenge.entity';

@Injectable()
export class ChallengesService {
  constructor(private readonly challengesRepository: ChallengesRepository) {}

  // 도전그룹 조회
  async getChallenges(): Promise<any> {
    const challenges = await this.challengesRepository.getChallenges();
    return challenges;
  }

  // 도전그룹 상세조회
  async getChallenge(challengeId: number): Promise<any> {
    const challenge = await this.challengesRepository.getChallenge(challengeId);
    if (!challenge) {
      throw new NotFoundException('도전을 찾을 수 없습니다.');
    }
    return challenge;
  }

  // 도전 삭제
  async deleteChallenge(challengeId: number): Promise<any> {
    const myChallenge = await this.challengesRepository.getChallenge(
      challengeId,
    );
    if (!myChallenge) {
      throw new NotFoundException('도전을 찾을 수 없습니다.');
    } // 도전 삭제권한 확인 필요. userId

    const today = new Date();
    if (myChallenge.userNumberLimit >= 2) {
      throw new BadRequestException('이미 도전에 참여한 회원이 존재합니다.');
    } else if (
      myChallenge.deadline <= today &&
      myChallenge.userNumberLimit >= 2
    ) {
      throw new BadRequestException(
        '이미 도전에 참여한 회원이 존재하며, 도전 시작일이 경과되었습니다.',
      );
    }
    return await this.challengesRepository.deleteChallenge(challengeId);
  }
}
