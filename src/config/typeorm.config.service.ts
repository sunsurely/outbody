import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Challenge } from 'src/challenges/entities/challenge.entity';
import { Goal } from 'src/challenges/entities/goal.entity';
import { User } from 'src/users/entities/user.entity';
import { Follow } from 'src/users/entities/follow.entity';
import { Record } from 'src/recodes/recodes.entity';
import { Report } from 'src/users/entities/report.entity';

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
      entities: [User, Challenge, Goal, Follow, Record, Report],
      synchronize: true,
    };
  }
}
