import { IsNumber, IsIn } from 'class-validator';
import { Gender } from '../userInfo';

export class UserUpdateDto {
  @IsNumber()
  readonly age: number;

  @IsNumber()
  readonly height: number;

  @IsIn([Gender.MALE, Gender.FEMALE])
  readonly gender: Gender;
}
