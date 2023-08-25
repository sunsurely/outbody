import { Controller, Post, UseGuards, Get, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 로컬 로그인
  // POST http://localhost:3000/auth/login
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() user: any) {
    return this.authService.login(user);
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
  async kakaoLoginRedirect(@Req() req) {
    return this.authService.kakaoLogin(req.user);
  }
}
