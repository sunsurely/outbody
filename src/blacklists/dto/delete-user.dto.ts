import { IsString, IsEmail, IsEmpty, IsNotEmpty } from 'class-validator';

export class DeleteUserDto {
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;
}
