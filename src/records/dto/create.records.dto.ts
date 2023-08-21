import { IsNumber, IsString } from 'class-validator';

export class CreateRecordDto {
  @IsNumber()
  readonly bmr: number;

  @IsNumber()
  readonly weight: number;

  @IsNumber()
  readonly muscle: number;

  @IsNumber()
  readonly fat: number;

  @IsString()
  readonly date: string;
}
