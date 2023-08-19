import { Body, Controller, Param, Post } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/signup')
  async createUser(@Body() userDto: UserDto) {
    try {
      const createUserResult = await this.userService.createUser(
        userDto.email,
        userDto.name,
        userDto.password,
        userDto.age,
        userDto.gender,
        userDto.height,
      );

      return createUserResult;
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  async getUserInfo(@Body() userDto: UserDto) {
    try {
      const getUserInfoResult = await this.userService.getUserInfo(
        userDto.email,
      );
      return getUserInfoResult;
    } catch (err) {
      console.error(err);
      return { status: err.status, message: err.message };
    }
  }
}
