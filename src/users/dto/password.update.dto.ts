import { IsString, Matches, IsNumber, IsIn } from 'class-validator';

import { Transform } from 'class-transformer';
import * as bcrypt from 'bcrypt';

export class UserUpdateDto {
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}/)
  readonly password: string;

  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}/)
  @Transform(({ value }) => bcrypt.hashSync(value, 10))
  readonly newPassword: string;
}
