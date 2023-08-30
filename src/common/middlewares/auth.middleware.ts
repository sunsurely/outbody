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

    let token: string;
    try {
      token = authHeader.split(' ')[1];
      const decodedToken = await this.jwtService.verify(token);

      if (!decodedToken || !decodedToken.id) {
        throw new UnauthorizedException(`Invalid JWT: ${decodedToken}`);
      }
      const user = await this.userRepository.findOne({
        where: { id: decodedToken.id },
      });

      req.user = user;

      next();
    } catch (err) {
      throw new UnauthorizedException(`Invalid JWT: ${token}`);
    }
  }
}
