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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 회원 가입 기능
  // POST http://localhost:3000/user/signup
  @Post('/signup')
  async createUser(@Body() usersDto: UserCreateDto) {
    const createUserResult = await this.userService.createUser(usersDto);
    return createUserResult;
  }

  // 사용자 정보 조회
  // GET http://localhost:3000/user/:userId
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

  // 내 정보 + 친구목록 조회
  // GET http://localhost:3000/user/me/frofile
  @Get('/me/profile')
  async getCurrentUser(@Req() req: any) {
    return await this.userService.getCurrentUser(req.user);
  }

  // 내 정보 수정
  // PATCH http://localhost:3000/user/me
  @Patch('/me')
  async updateUser(@Body() userDto: UserUpdateDto, @Req() req: any) {
    const userId = req.user.id;
    const { updateUser, refreshToken } = await this.userService.updateUser(
      userId,
      userDto,
    );
    return { updateUser, refreshToken };
  }

  // 유저 password수정
  // PATCH http://localhost:3000/user/me/password
  @Patch('/me/password')
  async updatePassword(@Body() passwordDto: UserPasswordDto, @Req() req: any) {
    return await this.userService.updatePassword(req.user.id, passwordDto);
  }

  // 회원 탈퇴
  // DELETE http://localhost:3000/user/me
  @Delete('/me')
  async deleteUser(@Req() req: any) {
    return await this.userService.deletUser(req.user.id);
  }
}
