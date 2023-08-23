import { IsString, IsEmail, IsEmpty, IsNotEmpty } from 'class-validator';

export class CreateBlacklistDto {
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;
}
