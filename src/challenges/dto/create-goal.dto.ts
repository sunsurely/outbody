import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreateGoalDto {
  @IsNotEmpty()
  @IsNumber()
  challengeId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(3)
  @Max(7)
  attend: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0) // 체중 감량만 가능하다고 가정
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
