import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';
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

  async login(user) {
    const payload = { user };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async kakaoLogin(user) {
    const existUser = await this.userService.getUserInfo(user.email);
    if (!existUser) {
      await this.userService.createUser();
    }

    return {
      access_token: this.jwtService.sign(user),
    };
  }
}
