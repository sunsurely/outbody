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
}
