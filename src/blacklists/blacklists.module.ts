import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlackList } from 'src/reports/entities/blacklist.entity';
import { BlacklistsController } from './controllers/blacklists.controller';
import { BlacklistsService } from './services/blacklists.service';
import { BlackListRepository } from './repository/blacklist.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BlackList])],
  controllers: [BlacklistsController],
  providers: [BlacklistsService, BlackListRepository],
})
export class BlackListModule {}
