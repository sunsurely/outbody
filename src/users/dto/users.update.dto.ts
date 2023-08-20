import { IsString, Matches, IsNumber } from 'class-validator';

export class UserUpdateDto {
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}/)
  readonly password: string;

  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}/)
  readonly newPassword: string;

  @IsNumber()
  readonly age: number;

  @IsNumber()
  readonly height: number;

  @IsString()
  readonly gender: string;
}
