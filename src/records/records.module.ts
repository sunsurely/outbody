import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from './entities/records.entity';
import { RecordsController } from './controllers/records.controller';
import { RecordsService } from './services/records.service';
import { RecordsRepository } from './repositories/records.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Record])],
  controllers: [RecordsController],
  providers: [RecordsService, RecordsRepository],
})
export class RecodesModule {}
