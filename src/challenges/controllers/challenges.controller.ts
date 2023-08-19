import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ChallengesService } from '../services/challenges.service';
import { CreateChallengeRequestDto } from '../dto/create-challenge.request.dto';

@Controller('challenge')
@UseInterceptors(Response)
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  // POST. http://localhost:3000/challenge
  @Post()
  async createChallenge(@Body() body: CreateChallengeRequestDto) {
    return await this.challengesService.createChallenge(body);
  }
}
