import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { BlacklistsService } from '../services/blacklists.service';
import { BlacklistDto } from '../dto/create-blacklist.dto';

@Controller('blacklists')
export class BlacklistsController {
  reportsService: any;
  constructor(private readonly blacklistService: BlacklistsService) {}

  //관리자 권한 블랙리스트 작성
  @Post('/')
  async createBlacklist(@Body() blacklist: BlacklistDto, @Req() req: any) {
    const { email, description } = blacklist;
    const { id, status } = req.user;

    return await this.reportsService.createBlacklist(
      email,
      description,
      id,
      status,
    );
  }

  //관리자 권한 모든 블랙리스트 조회
  @Get('/')
  async getAllBlacklist(@Req() req: any) {
    return await this.reportsService.getAllBlacklist(req.user.status);
  }

  //관리자 권한 유저 이메일로 블랙리스트 조회
  @Get('/detail')
  async getBlacklistByEmail(@Req() req: any, @Body() blacklist: BlacklistDto) {
    return await this.blacklistService.getBlacklistByEmail(
      req.user.status,
      blacklist.email,
    );
  }
}
