import { IsString, IsNumber } from 'class-validator';

export class KakaoLoginDto {
  @IsString()
  readonly birthday: string;

  @IsNumber()
  readonly height: number;

  @IsString()
  readonly gender: string;
}
