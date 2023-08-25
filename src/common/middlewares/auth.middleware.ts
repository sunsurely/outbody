import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/users/repositories/users.repository';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
  ) {}

  async use(req: any, res: any, next: Function) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('JWT not found');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid JWT format');
    }

    // 로그인 상태 확인과 유저정보 최신화 업데이트
    try {
      const { decoded } = await this.jwtService.verify(token);
      req.user = decoded;

      next();
    } catch (err) {
      throw new UnauthorizedException(`Invalid JWT: ${token}`);
    }
  }
}
