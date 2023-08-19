{
   “gender”:”여” ,
    ”age”:29,
   “height”:190cm,
   “password”: “k1234”,
   ”newPassword”:”k12345”,
}

import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  Matches,
  IsNumber,
} from 'class-validator';

export class UserCreateDto {
  
  
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
