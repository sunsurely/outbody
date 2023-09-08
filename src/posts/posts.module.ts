import { Module } from '@nestjs/common';
import { PostsController } from './controllers/posts.controller';
import { PostsService } from './services/posts.service';
import { PostsRepository } from './repositories/posts.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { AwsService } from 'src/aws.service';
import { ChallengersRepository } from 'src/challenges/repositories/challengers.repository';
import { ChallengesRepository } from 'src/challenges/repositories/challenges.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsRepository,
    AwsService,
    ChallengersRepository,
    ChallengesRepository,
  ],
})
export class PostsModule {}
