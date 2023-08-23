import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { UserCreateDto } from '../dto/users.create.dto';
import { UserService } from '../services/users.service';
import { UserUpdateDto } from '../dto/users.update.dto';
import { UserPasswordDto } from '../dto/password.update.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //회원 가입 기능 localhost:3000/users/signup
  @Post('/signup')
  async createUser(@Body() usersDto: UserCreateDto) {
    const createUserResult = await this.userService.createUser(usersDto);
    return createUserResult;
  }

  // 내 정보와 친구목록 함께 조회 localhost:3000/users/me
  @Get('/me')
  async getCurrentUserById(@Req() req: any) {
    const getUserInfoResult = await this.userService.getCurrentUserById(
      req.user.id,
    );
    return getUserInfoResult;
  }

  //사용자 정보 조회 localhost:3000/users/userId
  @Get('/:userId')
  async getUserById(
    @Param(
      'userId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    userId: number,
  ) {
    const getUserInfoResult = await this.userService.getUserById(userId);
    return getUserInfoResult;
  }

  //내 정보 수정 localhost:3000/users/me
  @Patch('/me')
  async updateUser(@Body() userDto: UserUpdateDto, @Req() req: any) {
    return await this.userService.updateUser(req.user.id, userDto);
  }

  //유저 password수정 localhost:3000/users/me/password
  @Patch('/me/password')
  async updatePassword(@Body() passwordDto: UserPasswordDto, @Req() req: any) {
    return await this.userService.updatePassword(req.user.id, passwordDto);
  }

  //회원 탈퇴 localhost:3000/users/me
  @Delete('/me')
  async deleteUser(@Req() req: any) {
    return await this.userService.deletUser(req.user.id);
  }
}
