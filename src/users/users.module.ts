import { Module } from '@nestjs/common';
import { UserController } from './controllers/users.controller';
import { UserService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/users.repository';
import { Follow } from 'src/follows/entities/follow.entity';
import { FollowsRepository } from 'src/follows/repositories/follows.repository';
import { BlackListRepository } from 'src/blacklists/repository/blacklist.repository';
import { AuthService } from 'src/auth/services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtConfigService } from 'src/config/jwt.config.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Follow]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    FollowsRepository,
    BlackListRepository,
    AuthService,
  ],
})
export class UsersModule {}
