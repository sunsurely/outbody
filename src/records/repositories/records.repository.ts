import { Injectable } from '@nestjs/common';
import { Record } from '../entities/records.entity';
import { DataSource, Repository, Between } from 'typeorm';

@Injectable()
export class RecordsRepository extends Repository<Record> {
  constructor(private readonly dataSource: DataSource) {
    super(Record, dataSource.createEntityManager());
  }

  //측정기록 생성
  async createRecord(
    userId: number,
    bmr: number,
    weight: number,
    muscle: number,
    fat: number,
    height: number,
  ): Promise<Record> {
    const newUser = this.create({
      userId,
      bmr,
      weight,
      muscle,
      fat,
      height,
    });
    return await this.save(newUser);
  }

  //현 유저의 모든 기록 불러오기
  async getUsersRecords(id: number): Promise<Record[]> {
    return this.find({
      select: [
        'id',
        'bmr',
        'fat',
        'height',
        'muscle',
        'weight',
        'userId',
        'createdAt',
      ],
      where: { userId: id },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  //현 유저의 상세 기록 불러오기
  async getRecordDeTail(id: number): Promise<Record> {
    return await this.findOne({ where: { id } });
  }

  // 현재 사용자의 최신 기록 1개만 불러오기 (재용)
  async getLatestUserRecord(id: number): Promise<Record> {
    return await this.findOne({
      where: { userId: id },
      order: { createdAt: 'DESC' },
    });
  }

  //기간별 기록들 불러오기
  async getRecordsByDateRange(
    start: Date,
    end: Date,
    id: number,
  ): Promise<Record[]> {
    const records = await this.find({
      select: [
        'id',
        'userId',
        'bmr',
        'fat',
        'height',
        'muscle',
        'weight',
        'createdAt',
      ],
      where: { createdAt: Between(start, end), userId: id },
      order: { createdAt: 'DESC' },
    });

    return records;
  }
}
