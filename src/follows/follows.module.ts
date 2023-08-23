import { Module } from '@nestjs/common';
import { FollowsService } from './services/follows.service';
import { FollowsController } from './controllers/follows.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from 'src/follows/entities/follow.entity';
import { FollowsRepository } from './repositories/follows.repository';
import { UserRepository } from 'src/users/repositories/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Follow])],
  controllers: [FollowsController],
  providers: [FollowsService, FollowsRepository, UserRepository],
})
export class FollowsModule {}
