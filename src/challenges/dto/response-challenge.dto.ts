import { IsNotEmpty, IsString } from 'class-validator';
import { Column } from 'typeorm';
import { Answer } from '../challengerInfo';

export class ResponseChallengeDto {
  @IsNotEmpty()
  @Column({ type: 'enum', enum: Answer })
  response: Answer;
}
