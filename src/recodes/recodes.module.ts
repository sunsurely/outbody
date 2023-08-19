import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordEntity } from './recodes.entity';

@Module({ imports: [TypeOrmModule.forFeature([RecordEntity])] })
export class RecodesModule {}
