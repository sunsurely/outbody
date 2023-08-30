import { IsOptional, IsString } from 'class-validator';

export class SignoutDto {
  @IsString()
  @IsOptional()
  readonly password?: string;
}
