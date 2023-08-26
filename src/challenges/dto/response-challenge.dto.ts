import { IsIn, IsNotEmpty } from 'class-validator';

export class ResponseChallengeDto {
  @IsNotEmpty()
  @IsIn(['yes', 'no'])
  response: string;
}
