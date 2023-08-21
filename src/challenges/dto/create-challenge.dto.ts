import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Position } from '../challengerInfo';

export class CreateChallengeDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsIn([Position.HOST, Position.GUEST])
  authorization: Position;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  title: string;

  @IsNotEmpty()
  @IsString()
  imgUrl: string;

  @IsNotEmpty()
  @IsString()
  startDate: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  challengeWeek: number;

  @IsNotEmpty()
  @IsString()
  endDate: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(2)
  @Max(10)
  userNumberLimit: number;

  @IsNotEmpty()
  @IsBoolean()
  publicView: boolean;

  @IsNotEmpty()
  @IsString()
  description: string;
}
