import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateChallengeRequestDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  title: string;

  @IsNotEmpty()
  @IsString()
  startDate: string;

  @IsNotEmpty()
  @IsString()
  endDate: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  challengeWeek: number;

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
  @Min(3)
  @Max(7)
  attend: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  weight: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  muscle: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  fat: number;
}
