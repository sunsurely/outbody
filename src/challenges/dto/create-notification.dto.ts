import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  message: string;
}
