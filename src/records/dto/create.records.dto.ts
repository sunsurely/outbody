import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRecordDto {
  @IsNotEmpty()
  @IsNumber()
  readonly bmr: number;

  @IsNotEmpty()
  @IsNumber()
  readonly weight: number;

  @IsNotEmpty()
  @IsNumber()
  readonly muscle: number;

  @IsNotEmpty()
  @IsNumber()
  readonly fat: number;

  @IsNotEmpty()
  @IsNumber()
  readonly height: number;
}
