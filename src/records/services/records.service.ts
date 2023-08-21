import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { RecordsRepository } from '../repositories/records.repository';
import { recordCache } from '../cache/initRecord.cache';
import { Record } from '../entities/records.entity';

@Injectable()
export class RecordsService {
  constructor(private readonly recordsRepository: RecordsRepository) {}

  //측정기록 생성 그리고 캐싱등록
  async createRecord(body, id) {
    const record = await this.recordsRepository.createRecord(body, id);
    if (!record) {
      throw new NotImplementedException('기록 생성에 실패했습니다');
    }

    const userRecords = await this.recordsRepository.getUsersRecords(id);

    if (!userRecords || userRecords.length <= 0) {
      throw new NotFoundException('기록을 불러오지 못했습니다.');
    }
    recordCache.set(`user:${id}`, userRecords);

    return record;
  }

  //현 유저의 모든 기록 메모리에서 불러오기/ 메모리에 없으면 DB에서 검색
  async getUsersRecords(id: number) {
    const cachedRecords = recordCache.get(`user:${id}`);

    if (cachedRecords) {
      return cachedRecords;
    }

    const records = await this.recordsRepository.getUsersRecords(id);
    if (!records || records.length <= 0) {
      throw new NotFoundException('등록된 데이터가 없습니다');
    }

    recordCache.set(`user:${id}`, records);

    return records;
  }

  //현 유저의 상세 기록 메모리에서 불러오기/ 캐싱된 데이터 없을 시 새롭게 세팅
  async getRecordDtail(recordId: number, id: number) {
    const cachedRecords: Record[] = recordCache.get(`user:${id}`);

    if (cachedRecords) {
      return cachedRecords.find((record) => record.id === recordId);
    }
    const records = await this.recordsRepository.getUsersRecords(id);
    if (!records) {
      throw new NotFoundException('등록된 데이터가 없습니다.');
    }
    recordCache.set(`user:${id}`, records);

    const record = await this.recordsRepository.getRecordDeTail(recordId);

    return record;
  }

  // 기간별 기록정보 불러오기
  async getRecordsByDateRange(start: string, end: string, id: number) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const getRecords = await this.recordsRepository.getRecordsByDateRange(
      startDate,
      endDate,
      id,
    );
    if (!getRecords || getRecords.length <= 0) {
      throw new NotFoundException('데이터 조회에 실패했습니다.');
    }

    return getRecords;
  }
}
