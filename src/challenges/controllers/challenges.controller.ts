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
}
