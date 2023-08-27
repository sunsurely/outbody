import { IsOptional, IsString } from 'class-validator';

export class UserUpdateDto {
  @IsString()
  @IsOptional()
  readonly imgUrl?: string;

  @IsString()
  @IsOptional()
  readonly comment?: string;

  @IsString()
  @IsOptional()
  readonly birthday?: string;
}
