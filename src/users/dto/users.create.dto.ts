import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  Matches,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import * as bcrypt from 'bcrypt';

export class UserCreateDto {
  @Transform(({ value, obj }) => {
    if (obj.password.includes(obj.name.trim())) {
      throw new BadRequestException(
        '비밀번호는 이름과 같은 문자열을 포함할 수 없습니다.',
      );
    }
    return value.trim();
  })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  readonly name: string;

  @IsString()
  @IsEmail()
  @MaxLength(60)
  readonly email: string;

  @IsNumber()
  @IsNotEmpty()
  readonly verifyNumberInput: number;

  @IsString()
  readonly birthday?: string;

  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}/)
  @Transform(({ value }) => bcrypt.hashSync(value, 10))
  readonly password: string;

  @IsString()
  readonly gender?: string;
}
