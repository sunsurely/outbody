import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Query,
  Param,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { BlacklistsService } from '../services/blacklists.service';
import { CreateBlacklistDto } from '../dto/create-blacklist.dto';
import { GetBlacklistDto } from '../dto/get.blacklist.dto';
import { DeleteUserDto } from '../dto/delete-user.dto';
import { AddBlacklistDto } from '../dto/add-blacklist.dto';

@Controller('blacklist')
export class BlacklistsController {
  reportsService: any;
  constructor(private readonly blacklistService: BlacklistsService) {}

  // 관리자 권한 블랙리스트 작성
  // POST http://localhost:3000/blacklist
  @Post('/')
  async createBlacklist(
    @Body() blacklist: CreateBlacklistDto,
    @Req() req: any,
  ) {
    const { email, description } = blacklist;
    const { id, status } = req.user;

    return await this.blacklistService.createBlacklist(
      email,
      description,
      id,
      status,
    );
  }

  // 관리자 권한 모든 블랙리스트 조회 (페이지네이션)
  // GET http://localhost:3000/blacklist
  @Get('/')
  async getAllBlacklist(
    @Req() req: any,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.blacklistService.getAllBlacklist(
      req.user.status,
      page,
      pageSize,
    );
  }

  // 관리자 권한 유저 이메일로 블랙리스트 조회
  // GET http://localhost:3000/blacklist/detail
  @Get('/detail')
  async getBlacklistByEmail(@Req() req: any, @Query('email') email: string) {
    return await this.blacklistService.getBlacklistByEmail(
      req.user.status,
      email,
    );
  }

  // 관리자 권한 블랙리스트 유저 강제탈퇴
  // DELETE http://localhost:3000/blacklist/withdraw
  @Delete('/withdraw')
  async withdrawUser(@Req() req: any, @Body() deleteUserDto: DeleteUserDto) {
    const { email, description } = deleteUserDto;
    await this.blacklistService.withdrawUser(
      req.user.status,
      email,
      description,
    );
  }

  // 관리자 권한 블랙리스트 유저 취소 (일반회원으로 전환)
  @Delete('/:blacklistId')
  async deleteBlacklist(
    @Req() req: any,
    @Param(
      'blacklistId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    blacklistId: number,
  ) {
    await this.blacklistService.removeBlacklist(req.user.status, blacklistId);
  }

  // 관리자 권한 userId로 블랙리스트 전환
  // POST http://localhost:3000/blacklist/:userId
  @Post('/:userId')
  async addBlacklist(
    @Req() req: any,
    @Body() addBlacklistDto: AddBlacklistDto,
    @Param(
      'userId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    userId: number,
  ) {
    const { description } = addBlacklistDto;

    return await this.blacklistService.addBlacklist(
      req.user.status,
      userId,
      description,
    );
  }

  //관리자 페이지 접근권한 확인
  @Get('/permision')
  async getPermission(@Req() req: any) {
    if (req.user.status !== 'admin') {
      return false;
    }
    return true;
  }
}
