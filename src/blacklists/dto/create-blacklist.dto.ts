import { IsString, IsEmail, IsEmpty } from 'class-validator';

export class BlacklistDto {
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsEmpty()
  @IsString()
  readonly description: string;
}
