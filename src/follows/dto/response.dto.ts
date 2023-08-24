import { IsEnum, IsIn } from 'class-validator';

export class ResponseDto {
  @IsIn(['yes', 'no'])
  readonly response: string;
}
