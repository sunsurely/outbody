import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostRequestDto {
  @IsNotEmpty()
  @IsString()
  readonly description: string;
}
