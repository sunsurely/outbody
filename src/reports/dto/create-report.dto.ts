import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateReportDto {
  @IsString()
  @MinLength(10)
  @MaxLength(100)
  readonly description: string;
}
