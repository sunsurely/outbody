import {
  Controller,
  Post,
  UseGuards,
  Get,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //로컬 로그인  localhost:3000/auth/login
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() user: any) {
    return await this.authService.login(user);
  }

  //Refresh토큰을 이용한 엑세스 토큰 재발급 localhost:3000/auth/refresh
  //유저가 로그인 상태일 때만 사용 가능한 엔드포인트
  @UseGuards(AuthGuard('jwt'))
  @Post('refresh')
  async refresh(@Req() req: any) {
    const { refresh_token } = req.header;

    if (refresh_token) {
      throw new BadRequestException('Refresh token is required');
    }

    const newAccessToken = await this.authService.refreshAccessToken(
      refresh_token,
    );
    return { access_token: newAccessToken };
  }

  //카카오 소셜 로그인 페이지 로딩 기능 localhost:3000/auth/kakao
  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {}

  //카카오 소셜 로그인기능
  @Get('kakao/redirect')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLoginRedirect(@Req() req: any) {
    return await this.authService.kakaoLogin(req.user);
  }
}
