import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { KakaoStrategy } from './strategies/kakao.strategy';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtConfigService } from 'src/config/jwt.config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/users/repositories/users.repository';
import { NaverStrategy } from './strategies/naver.strategy';
import { UserService } from 'src/users/services/users.service';
import { BlackListRepository } from 'src/blacklists/repository/blacklist.repository';
import { FollowsRepository } from 'src/follows/repositories/follows.repository';
import { JwtRefreshStrategy } from './strategies/refreshToken.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    KakaoStrategy,
    UserRepository,
    NaverStrategy,
    JwtRefreshStrategy,
    UserService,
    BlackListRepository,
    FollowsRepository,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthsModule {}
