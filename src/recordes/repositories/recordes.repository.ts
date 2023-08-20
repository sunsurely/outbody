import { Injectable } from '@nestjs/common';
import { Record } from '../entities/recordes.entity';
import { DataSource, Repository, Between } from 'typeorm';
import { CreateRecordDto } from '../dto/create.records.dto';

@Injectable()
export class RecordsRepository extends Repository<Record> {
  constructor(private readonly dataSource: DataSource) {
    super(Record, dataSource.createEntityManager());
  }

  //측정기록 생성
  async createRecord(body: CreateRecordDto, id: number): Promise<Record> {
    const { bmr, weight, muscle, fat, date } = body;
    const recordDate = new Date(date);
    const newUser = this.create({
      bmr,
      weight,
      muscle,
      fat,
      date: recordDate,
      userId: id,
    });
    return await this.save(newUser);
  }

  //모든 기록 불러오기
  async getAllRecords(): Promise<Record[]> {
    return this.find();
  }

  //기간별 기록들 불러오기
  async getRecordsByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<Record[]> {
    startDate.setDate(startDate.getDate() - 1);
    const records = await this.find({
      where: { date: Between(startDate, endDate) },
    });
    return records;
  }
}
