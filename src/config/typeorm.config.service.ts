import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Challenge } from 'src/challenges/entities/challenge.entity';
import { Goal } from 'src/challenges/entities/goal.entity';
import { User } from 'src/users/entities/user.entity';
import { Follow } from 'src/follows/entities/follow.entity';
import { Record } from 'src/records/entities/records.entity';
import { Report } from 'src/reports/entities/report.entity';
import { Challenger } from 'src/challenges/entities/challenger.entity';
import { BlackList } from 'src/reports/entities/blacklist.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Like } from 'src/likes/entities/like.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { FollowMessage } from 'src/follows/entities/followMessage.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT'),
      username: this.configService.get<string>('DATABASE_USERNAME'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_NAME'),
      entities: [
        User,
        Challenge,
        Goal,
        Follow,
        Record,
        Report,
        Challenger,
        BlackList,
        Post,
        Like,
        Comment,
        FollowMessage,
      ],
      synchronize: true,
      // logging: true,
    };
  }
}
