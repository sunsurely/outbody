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
  Query,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserCreateDto } from '../dto/users.create.dto';
import { UserService } from '../services/users.service';
import { UserUpdateDto } from '../dto/users.update.dto';
import { UserPasswordDto } from '../dto/password.update.dto';
import { UserRecommendationDto } from '../dto/recommendation.dto';
import { SignoutDto } from '../dto/user.signout.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { cache } from '../cache/user.cache';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 회원 가입 기능
  // POST http://localhost:3000/user/signup
  @Post('/signup')
  async createUser(@Body() usersDto: UserCreateDto) {
    const verifyNumber: number = await cache.get(usersDto.email);
    const createUserResult = await this.userService.createUser(
      usersDto,
      verifyNumber,
    );
    cache.del(usersDto.email);
    return createUserResult;
  }

  // E-mail 인증 기능 (재용)
  // POST http://localhost:3000/user/signup/email
  @Post('/signup/email')
  async sendEmail(@Body() body: any) {
    const verifyNumber: number = await this.userService.sendEmail(body);
    await cache.set(`${body.email}`, verifyNumber);
    return { message: '인증번호가 발송되었습니다.' };
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
  // GET http://localhost:3000/user/me/profile
  @Get('/me/profile')
  async getCurrentUser(@Req() req: any) {
    const MeAndFollowersInfo = await this.userService.getUserInfo(req.user);
    return MeAndFollowersInfo;
  }

  // 내 정보 수정
  // PATCH http://localhost:3000/user/me
  @Patch('/me')
  @UseInterceptors(FileInterceptor('image'))
  async updateUser(
    @Body() body: UserUpdateDto,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.userService.updateUser(req.user, body, file);
  }

  // 유저 password수정
  // PUT http://localhost:3000/user/me/password
  @Patch('/me/password')
  async updatePassword(@Body() passwordDto: UserPasswordDto, @Req() req: any) {
    return await this.userService.updatePassword(req.user, passwordDto);
  }

  // 회원 탈퇴
  // DELETE http://localhost:3000/user/me/signout
  @Delete('/me/signout')
  async deleteUser(@Req() req: any, @Body() signoutDto: SignoutDto) {
    return await this.userService.deletUser(req.user, signoutDto);
  }

  // 유저 전체목록 조회(나와 친구관계가 아닌 모든 유저 불러옴)
  // GET http://localhost:3000/user/me/recommendation
  @Get('/me/recommendation')
  async getAllUsers(@Req() req: any): Promise<UserRecommendationDto[]> {
    const userId = req.user.id;
    const allUsers = await this.userService.getAllUsers(userId);

    return allUsers;
  }

  //email로 user조회
  //GET  http://localhost:3000/user/me/searchEmail
  @Get('/me/searchEmail')
  async getUserByEmail(@Query('email') email: string) {
    return await this.userService.getUserByEmail(email);
  }

  // 친구 수 조회
  //Get http://localhost:3000/user/me/friendCount
  @Get('/me/friendCount')
  async getCountFriends(@Req() req: any) {
    const userId = req.user;
    const MeAndFollowersInfo = await this.userService.getUserInfo(userId);
    const friendCount = MeAndFollowersInfo.followersInfo.length;
    return friendCount;
  }

  //유저 랭크 조회
  //Get http://localhost:3000/user/me/rank
  @Get('/me/rank')
  async getUsersRank(@Req() req: any) {
    const myRank = await this.userService.getUsersRank(req.user.id);
    return myRank;
  }

  // 관리자 권한 전체 유저조회
  //Get http://localhost:3000/user/me/allusers
  @Get('/me/allusers')
  async getAllregisters(
    @Req() req: any,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.userService.getAllregisters(
      req.user.status,
      page,
      pageSize,
    );
  }
}
//
