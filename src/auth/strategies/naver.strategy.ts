import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { AuthService } from '../services/auth.service';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.NAVER_ID,
      clientSecret: process.env.NAVER_CALLBACK_URL,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const user = {
      email: profile._json.email,
      name: profile.displayName,
      imgUrl: profile._json.profile_image,
      gender: profile._json.gender,
      birthday: profile._json.birthday,
    };
    if (
      !user.email ||
      !user.name ||
      !user.imgUrl ||
      !user.gender ||
      !user.birthday
    ) {
      throw new BadRequestException(
        '미기입된 항목이 있습니다. 모두 입력해주세요.',
      );
    }
    return user;
  }
}
