import { IsString, MaxLength, IsEmail, Matches } from 'class-validator';

export class UserLoginDto {
  @IsString()
  @IsEmail()
  @MaxLength(60)
  readonly email: string;

  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}/)
  readonly password: string;
}
