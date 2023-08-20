import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { ChallengesService } from '../services/challenges.service';
import { CreateChallengeRequestDto } from '../dto/create-challenge.request.dto';
import { InviteChallengeDto } from '../dto/invite-challenge.dto';

@Controller('challenge')
@UseInterceptors(Response)
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  // 도전 생성 POST. http://localhost:3000/challenge
  @Post()
  async createChallenge(@Body() body: CreateChallengeRequestDto) {
    return await this.challengesService.createChallenge(body);
  }

  // 도전그룹 목록조회 GET http://localhost:3000/challenge
  @Get()
  async getChallenges() {
    const challenges = await this.challengesService.getChallenges();
    return challenges;
  }

  // 도전그룹 상세조회 GET http://localhost:3000/challenge/:id
  @Get('/:challengeId')
  async getChallenge(@Param('challengeId') challengeId: number) {
    const challenge = await this.challengesService.getChallenge(challengeId);
    return challenge;
  }

  // 도전 삭제 DELETE http://localhost:3000/challenge/:id
  @Delete('/:challengeId')
  async deleteChallenge(@Param('challengeId') challengeId: number) {
    const remove = await this.challengesService.deleteChallenge(challengeId);
    if (remove) {
      return { message: '회원님의 도전이 성공적으로 삭제되었습니다' };
    }
  }

  // 도전 친구초대 POST http://localhost:3000/challenge/:id/invite
  @Post('/:challengeId/invite')
  async inviteChallenge(
    @Param('challengeId') challengeId: number,
    @Body() body: InviteChallengeDto,
  ) {
    return await this.challengesService.inviteChallenge(challengeId, body);
    // if(invite){
    //   return { message: '친구초대가 정상적으로 완료되었습니다.' }
    // }
  }
}
