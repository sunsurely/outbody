import { IsNotEmpty, IsString } from 'class-validator';

export class InviteChallengeDto {
  @IsNotEmpty()
  @IsString()
  email: string;
}
