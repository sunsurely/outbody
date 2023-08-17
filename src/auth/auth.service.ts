import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserInfo(email);
    const comparedPassword = compare(password, user.password);
    if (user && comparedPassword) {
      return user;
    }
    return null;
  }

  async login(email: string) {
    const payload = { email, sub: email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async kakaoLogin(user) {
    const payload = { email: user.email, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
