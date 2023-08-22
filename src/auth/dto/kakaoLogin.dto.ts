import { IsString, IsNumber } from 'class-validator';

export class KakaoLoginDto {
  @IsNumber()
  readonly age: number;

  @IsNumber()
  readonly height: number;

  @IsString()
  readonly gender: string;
}
