import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChallengesService } from '../services/challenges.service';
import { CreateChallengeDto } from '../dto/create-challenge.dto';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  // 도전그룹 조회
  @Get()
  async getChallenges() {
    const challenges = await this.challengesService.getChallenges();
    return challenges;
  }

  // 도전그룹 상세조회
  @Get('/:challengeId')
  async getChallenge(@Param('challengeId') challengeId: number) {
    const challenge = await this.challengesService.getChallenge(challengeId);
    return challenge;
  }

  // 도전 삭제
  @Delete('/:challengeId')
  async deleteChallenge(@Param('challengeId') challengeId: number) {
    const remove = await this.challengesService.deleteChallenge(challengeId);
    if (remove) {
      return { message: '회원님의 도전이 성공적으로 삭제되었습니다' };
    }
  }
}
