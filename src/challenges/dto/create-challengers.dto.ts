import { IsBoolean, IsIn, IsNotEmpty, IsNumber } from 'class-validator';
import { Position } from '../challengerInfo';

export class CreateChallengerDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  challengeId: number;

  @IsIn([Position.HOST, Position.GUEST])
  authorization: Position;

  @IsNotEmpty()
  @IsBoolean()
  done: boolean;
}
