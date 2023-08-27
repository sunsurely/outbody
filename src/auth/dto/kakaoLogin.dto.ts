import { IsString, IsNumber, IsOptional } from 'class-validator';

export class KakaoLoginDto {
  @IsString()
  @IsOptional()
  readonly birthday?: string;

  @IsString()
  readonly gender: string;
}
