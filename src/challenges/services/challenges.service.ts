import { Injectable } from '@nestjs/common';
import { ChallengesRepository } from '../repositories/challenges.repository';
import { CreateChallengeRequestDto } from '../dto/create-challenge.request.dto';

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
