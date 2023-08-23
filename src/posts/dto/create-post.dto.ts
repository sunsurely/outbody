import { IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  readonly description: string;

  @IsString()
  readonly imgUrl: string;
}
