import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.config.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthsModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from './config/jwt.config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChallengesModule } from './challenges/challenges.module';
import { PostsModule } from './posts/posts.module';
import { RecordsModule } from './records/records.module';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { FollowsModule } from './follows/follows.module';
import { ReportsModule } from './reports/reports.module';
import { BlackListModule } from './blacklists/blacklists.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { RankingsModule } from './rankings/rankings.module';
import { AwsService } from './aws.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
      inject: [ConfigService],
    }),
    AuthsModule,
    UsersModule,
    ChallengesModule,
    PostsModule,
    RecordsModule,
    FollowsModule,
    ReportsModule,
    BlackListModule,
    LikesModule,
    CommentsModule,
    RankingsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AwsService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'user/signup', method: RequestMethod.POST },
        { path: 'auth/kakao', method: RequestMethod.GET },
        { path: 'auth/naver', method: RequestMethod.GET },
        { path: 'blacklist/withdraw', method: RequestMethod.DELETE },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
