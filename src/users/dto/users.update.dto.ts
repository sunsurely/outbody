import { IsString } from 'class-validator';

export class UserUpdateDto {
  @IsString()
  readonly imgUrl: string;

  @IsString()
  readonly comment: string;
}
