import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class InviteChallengeDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
}
