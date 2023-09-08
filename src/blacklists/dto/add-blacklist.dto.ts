import { IsString, IsNotEmpty } from 'class-validator';

export class AddBlacklistDto {
  @IsNotEmpty()
  @IsString()
  readonly description: string;
}
