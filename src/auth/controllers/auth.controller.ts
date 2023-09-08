import { Controller, Post, UseGuards, Get, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 로컬 로그인
  // POST http://localhost:3000/auth/login
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: any) {
    const userId = req.user.id;

    const { accessToken, ...accessOption } =
      await this.authService.getAccessToken(userId);
    const { refreshToken, ...refreshOption } =
      await this.authService.getRefreshToken(userId);

    await this.authService.setRefreshToken(refreshToken, userId);

    return { userId, accessToken, refreshToken };
  }

  // 로그아웃
  // POST http://localhost:3000/auth/logout
  @UseGuards(AuthGuard('local'))
  @Post('logout')
  async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    // const { accessOption, refreshOption } = this.authService.logout();
    await this.authService.removeRefreshToken(req.user.id);

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.send({
      message: 'logout success',
    });

    // res.cookie('Authentication', '', accessOption);
    // res.cookie('Refresh', '', refreshOption);
  }

  // 카카오 소셜 로그인 페이지 로딩 기능
  // GET http://localhost:3000/auth/kakao
  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {
    console.log('kakaoLogin');
  }

  // 카카오 소셜 로그인기능
  // GET http://localhost:3000/auth/kakao/redirect
  @Get('kakao/oauth')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLoginRedirect(@Req() req: any, @Res() res: Response) {
    const token = await this.authService.kakaoLogin(req.user);
    res.redirect(`http://127.0.0.1:5500/dist/index-0.html`);
  }

  // 네이버 소셜 로그인 페이지 로딩 기능
  // GET http://localhost:3000/auth/naver
  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  async naverLogin() {
    console.log('naverLogin');
  }

  // 네이버 소셜 로그인기능
  // GET http://localhost:3000/auth/naver/redirect
  @Get('naver/redirect')
  @UseGuards(AuthGuard('naver'))
  async naverLoginRedirect(@Req() req: any) {
    return await this.authService.naverLogin(req.user);
  }
}
