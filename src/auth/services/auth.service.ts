import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UserRepository } from 'src/users/repositories/users.repository';
import { UserService } from 'src/users/services/users.service';
import { UserCreateDto } from 'src/users/dto/users.create.dto';
import { Provider } from 'src/users/userInfo';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  // 유저 확인
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저입니다');
    }

    const comparedPassword = await compare(password, user.password);
    if (!comparedPassword) {
      throw new NotAcceptableException('비밀번호가 일치하지 않습니다.');
    }

    if (user && comparedPassword) {
      return user;
    }
  }

  // 로그인 (access토큰 발급)
  async getAccessToken(id: number) {
    const payload = { id };
    const token = this.jwtService.sign(payload, {
      secret: await this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: await this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      ),
    });

    return {
      accessToken: token,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24,
    };
  }

  // refresh토큰 발급
  async getRefreshToken(id: number) {
    const payload = { id };
    const token = this.jwtService.sign(payload, {
      secret: await this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: await this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      ),
    });

    return {
      refreshToken: token,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24,
    };
  }

  // 로그아웃
  logout() {
    return {
      accessOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: 0,
      },
      refreshOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: 0,
      },
    };
  }

  // 토큰 제거
  async removeRefreshToken(userId: number) {
    const logout = await this.userRepository.update(userId, {
      refreshToken: null,
    });
    return logout;
  }

  // Refresh 토큰 set, hash처리
  async setRefreshToken(refreshToken: string, id: number) {
    const hashedRefreshToken = await hash(refreshToken, 10);
    await this.userRepository.update(id, { refreshToken: hashedRefreshToken });
  }

  // 토큰값 동일할경우 유저반환
  async refreshTokenMatches(refreshToken: string, id: number) {
    const user = await this.userRepository.getUserById(id);
    const refreshTokenMatching = await compare(refreshToken, user.refreshToken);
    if (refreshTokenMatching) {
      return user;
    }
  }

  // 카카오 로그인
  async kakaoLogin(user) {
    const existUser = await this.userRepository.getUserByEmail(user.email);
    if (!existUser) {
      const newKakaoUser = await this.userRepository.create({
        name: user.nickname,
        email: user.email,
        gender: user.gender,
        provider: Provider.KAKAO,
      });

      await this.userRepository.save(newKakaoUser);
    }
    return user.email;
  }

  // 네이버 로그인
  async naverLogin(user) {
    const existUser = await this.userRepository.getUserByEmail(user.email);
    if (!existUser) {
      // await this.userService.createUser();
    }
    const access_token = this.jwtService.sign(user);
    return access_token;
  }
}
