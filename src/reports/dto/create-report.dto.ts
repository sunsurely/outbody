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

export class CreateReportDto {
  @IsString()
  @MinLength(10)
  @MaxLength(100)
  readonly description: string;
}
