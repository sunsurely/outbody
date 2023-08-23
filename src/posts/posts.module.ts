import { Module } from '@nestjs/common';
import { PostsController } from './controllers/posts.controller';
import { PostsService } from './services/posts.service';
import { PostsRepository } from './repositories/posts.repository';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
})
export class PostModule {}
