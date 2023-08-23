import { IsDateString, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class RangeRecordDto {
  @IsString()
  readonly start: string;

  @IsString()
  readonly end: string;
}
