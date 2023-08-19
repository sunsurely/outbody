import { Module } from '@nestjs/common';
import { PostsService } from './services/posts.service';
import { PostsController } from './controllers/posts.controller';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostModule {}
