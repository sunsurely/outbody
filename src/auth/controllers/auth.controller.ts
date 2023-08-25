import { UserService } from './../../users/services/users.service';
import {
  Controller,
  Post,
  UseGuards,
  Get,
  Req,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // 로컬 로그인
  // POST http://localhost:3000/auth/login
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const user = req.user;

    const { accessToken, ...accessOption } =
      await this.authService.getAccessToken(user.id);

    const { refreshToken, ...refreshOption } =
      await this.authService.getRefreshToken(user.id);

    await this.authService.setRefreshToken(refreshToken, user.id);

    res.cookie('Authentication', accessToken, accessOption);
    res.cookie('Refresh', refreshToken, refreshOption);

    return { accessToken, refreshToken };
  }

  // 로그아웃
  // POST http://localhost:3000/auth/logout
  @UseGuards(AuthGuard('local'))
  @Post('logout')
  async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    // const { accessOption, refreshOption } = this.authService.logout();
    await this.authService.removeRefreshToken(req.user.id);

    // res.cookie('Authentication', '', accessOption);
    // res.cookie('Refresh', '', refreshOption);
  }

  // 카카오 소셜 로그인 페이지 로딩 기능
  // GET http://localhost:3000/auth/kakao
  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {}

  // 카카오 소셜 로그인기능
  // GET http://localhost:3000/auth/kakao/redirect
  @Get('kakao/redirect')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLoginRedirect(@Req() req: any) {
    return await this.authService.kakaoLogin(req.user);
  }

  // 네이버 소셜 로그인 페이지 로딩 기능
  // GET http://localhost:3000/auth/naver
  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  async naverLogin() {}

  // 네이버 소셜 로그인기능
  // GET http://localhost:3000/auth/naver/redirect
  @Get('naver/redirect')
  @UseGuards(AuthGuard('naver'))
  async naverLoginRedirect(@Req() req: any) {
    return await this.authService.naverLogin(req.user);
  }
}
