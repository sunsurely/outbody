import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { RecordsRepository } from '../repositories/records.repository';
import { recordCache } from '../cache/initRecord.cache';
import { Record } from '../entities/records.entity';
import { RecordCachingService } from './recordsCache.service';

@Injectable()
export class RecordsService {
  constructor(
    private readonly recordsRepository: RecordsRepository,
    private readonly recordCachingService: RecordCachingService,
  ) {}

  //측정기록 생성 그리고 캐싱등록
  async createRecord(body, id) {
    return await this.recordCachingService.setCacheReports(body, id);
  }

  //현 유저의 모든 기록 메모리에서 불러오기/ 메모리에 없으면 DB에서 검색
  async getUsersRecords(id: number) {
    return await this.recordCachingService.getCacheAllUsersReports(id);
  }

  //현 유저의 상세 기록 메모리에서 불러오기/ 캐싱된 데이터 없을 시 새롭게 세팅
  async getRecordDtail(recordId: number, id: number) {
    return await this.recordCachingService.getCacheDetailReport(recordId, id);
  }

  //기간별 기록정보 불러오기
  async getRecordsByDateRange(start: Date, end: Date, id: number) {
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
