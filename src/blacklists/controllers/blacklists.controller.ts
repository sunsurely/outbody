import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { BlacklistsService } from '../services/blacklists.service';
import { CreateBlacklistDto } from '../dto/create-blacklist.dto';
import { GetBlacklistDto } from '../dto/get.blacklist.dto';

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

  // 관리자 권한 모든 블랙리스트 조회
  // GET http://localhost:3000/blacklist
  @Get('/')
  async getAllBlacklist(@Req() req: any) {
    return await this.blacklistService.getAllBlacklist(req.user.status);
  }

  // 관리자 권한 유저 이메일로 블랙리스트 조회
  // GET http://localhost:3000/blacklist/detail
  @Get('/detail')
  async getBlacklistByEmail(
    @Req() req: any,
    @Body() blacklist: GetBlacklistDto,
  ) {
    return await this.blacklistService.getBlacklistByEmail(
      req.user.status,
      blacklist.email,
    );
  }
}
