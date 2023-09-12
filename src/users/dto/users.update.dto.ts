import { IsOptional, IsString } from 'class-validator';

export class UserUpdateDto {
  @IsString()
  @IsOptional()
  readonly imgUrl?: string;

  @IsString()
  @IsOptional()
  readonly birthday?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsString()
  @IsOptional()
  readonly name?: string;
}
