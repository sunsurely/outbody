import { IsString, IsEmail, IsEmpty, IsNotEmpty } from 'class-validator';

export class GetBlacklistDto {
  @IsString()
  @IsEmail()
  readonly email: string;
}
