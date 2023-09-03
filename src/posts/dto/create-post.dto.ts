import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsNumber()
  challengeId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  imgUrl: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;
}
