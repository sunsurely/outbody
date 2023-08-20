import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from './entities/recordes.entity';
import { RecordesController } from './controllers/recordes.controller';
import { RecordesService } from './services/recordes.service';
import { RecordsRepository } from './repositories/recordes.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Record])],
  controllers: [RecordesController],
  providers: [RecordesService, RecordsRepository],
})
export class RecodesModule {}
