import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { AuthService } from '../services/auth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.KAKAO_ID,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const kakaoAccount = profile._json.kakao_account;
    const profileInfo = kakaoAccount.profile;
    const user = {
      email: kakaoAccount.email,
      gender: kakaoAccount.gender,
      birthday: kakaoAccount.birthday,
      nickname: profileInfo.nickname,
    };
    return user;
  }
}
