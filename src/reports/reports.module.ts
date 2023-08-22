import { Module } from '@nestjs/common';
import { ReportsService } from './services/reports.service';
import { ReportsController } from './controllers/reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { ReportsRepository } from './repositories/reports.repository';
import { BlackList } from './entities/blacklist.entity';
import { BlackListRepository } from './repositories/blacklist.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Report, BlackList])],
  controllers: [ReportsController],
  providers: [ReportsService, ReportsRepository, BlackListRepository],
})
export class ReportsModule {}
