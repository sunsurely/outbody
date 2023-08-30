import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateChallengeDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  title: string;

  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  challengeWeek: number;

  @IsNotEmpty()
  @IsDate()
  endDate: Date;

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

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  entryPoint: number;

  @IsNotEmpty()
  @IsBoolean()
  isDistributed: boolean;
}
