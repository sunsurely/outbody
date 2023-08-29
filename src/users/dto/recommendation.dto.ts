import { IsOptional, IsString } from 'class-validator';

export class UserRecommendationDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly email?: string;

  @IsString()
  @IsOptional()
  readonly imgUrl?: string;
}
