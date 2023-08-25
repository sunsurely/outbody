import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UserRepository } from 'src/users/repositories/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저입니다');
    }

    const comparedPassword = await compare(password, user.password);

    if (user && comparedPassword) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload, { expiresIn: '2h' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { access_token, refresh_token };
  }

  // Refresh Token 검증 및 새로운 Access Token 발급 메서드
  async refreshAccessToken(refresh_token: string): Promise<string> {
    try {
      const decoded = this.jwtService.verify(refresh_token);
      const user = await this.userRepository.findOne(decoded.sub);

      if (!user) {
        throw new UnauthorizedException('Invalid user');
      }

      const payload = { sub: user.id, email: user.email };
      const access_token = this.jwtService.sign(payload);

      return access_token;
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException(`Invalid refresh token: ${err.message}`);
    }
  }

  async kakaoLogin(user: User) {
    const existUser = await this.userRepository.getUserByEmail(user.email);
    if (!existUser) {
      // await this.userService.createUser();
    }
    const access_token = this.jwtService.sign(user);
    return access_token;
  }
}
