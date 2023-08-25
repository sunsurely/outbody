import { Module } from '@nestjs/common';
import { UserController } from './controllers/users.controller';
import { UserService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/users.repository';
import { Follow } from 'src/follows/entities/follow.entity';
import { FollowsRepository } from 'src/follows/repositories/follows.repository';
import { BlackListRepository } from 'src/blacklists/repository/blacklist.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Follow])],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    FollowsRepository,
    BlackListRepository,
  ],
})
export class UsersModule {}
