import { IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class RangeRecordDto {
  @IsDateString()
  @Transform(({ value }) => new Date(value))
  start: Date;

  @IsDateString()
  @Transform(({ value }) => new Date(value))
  end: Date;
}
