import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from './recodes.entity';

@Module({ imports: [TypeOrmModule.forFeature([Record])] })
export class RecodesModule {}
