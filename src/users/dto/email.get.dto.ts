import { IsString, MaxLength, IsEmail } from 'class-validator';

export class GetUserByEmailDto {
  @IsString()
  @IsEmail()
  @MaxLength(60)
  readonly email: string;
}
