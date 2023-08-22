import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  Get,
  Delete,
  Param,
  Req,
} from '@nestjs/common';
import { ChallengesService } from '../services/challenges.service';
import { CreateChallengeRequestDto } from '../dto/create-challenge.request.dto';
import { InviteChallengeDto } from '../dto/invite-challenge.dto';
import { Position } from '../challengerInfo';
import { ResponseChallengeDto } from '../dto/response-challenge.dto';

@Controller('challenge')
@UseInterceptors(Response)
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  // 도전 생성 (완성)
  // POST. http://localhost:3000/challenge
  @Post()
  async createChallenge(
    @Body() body: CreateChallengeRequestDto,
    @Req() req: any,
  ) {
    return await this.challengesService.createChallenge(body, req.user.id);
  }

  // 도전 목록조회 (완성)
  // GET http://localhost:3000/challenge
  @Get()
  async getChallenges() {
    const challenges = await this.challengesService.getChallenges();
    return challenges;
  }

  // 도전 상세조회 (완성)
  // GET http://localhost:3000/challenge/:id
  @Get('/:challengeId')
  async getChallenge(@Param('challengeId') challengeId: number) {
    const challenge = await this.challengesService.getChallenge(challengeId);
    return challenge;
  }

  // 도전 삭제 (완성)
  // DELETE http://localhost:3000/challenge/:id
  @Delete('/:challengeId')
  async deleteChallenge(@Param('challengeId') challengeId: number) {
    const remove = await this.challengesService.deleteChallenge(challengeId);
    if (remove) {
      return { message: '도전이 성공적으로 삭제되었습니다.' };
    }
  }

  // 도전자 목록조회 (완성)
  // GET http://localhost:3000/challenge/:id/challenger
  @Get('/:challengeId/challenger')
  async getChallengers(@Param('challengeId') challengeId: number) {
    const challengers = await this.challengesService.getChallengers(
      challengeId,
    );
    return challengers;
  }

  // 도전 방 입장
  // POST http://localhost:3000/challenge/:id/enter
  @Post('/:challengeId/enter')
  async joinChallenge(
    @Param('challengeId') challengeId: number,
    @Body() type: Position,
    @Req() req: any,
  ) {
    return await this.challengesService.joinChallenge(
      challengeId,
      type,
      req.user.id,
    );
  }

  // 도전 방 퇴장
  // POST http://localhost:3000/challenge/:id/leave
  @Delete('/:challengeId/leave')
  async leaveChallenge(
    @Param('challengeId') challengeId: number,
    @Req() req: any,
  ) {
    return await this.challengesService.leaveChallenge(
      challengeId,
      req.user.id,
    );
  }

  // 도전 친구초대
  // POST http://localhost:3000/challenge/:id/invite
  @Post('/:challengeId/invite')
  async inviteChallenge(
    @Param('challengeId') challengeId: number,
    @Body() body: InviteChallengeDto,
    @Req() req: any,
  ) {
    return await this.challengesService.inviteChallenge(
      challengeId,
      body,
      req.user.id,
    );
  }

  // 도전 초대수락
  // POST http://localhost:3000/challenge/:id/accept
  @Post('/:challengeId/accept')
  async acceptChallenge(
    @Param('challengeId') challengeId: number,
    @Body() body: ResponseChallengeDto,
    @Req() req: any,
  ) {
    return await this.challengesService.acceptChallenge(
      challengeId,
      body,
      req.user.id,
    );
  }
}
