import { Injectable } from '@nestjs/common';
import { RecordCachingService } from './recordsCache.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RecordsService {
  constructor(private readonly recordCachingService: RecordCachingService) {}

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
  async getRecordsByDateRange(startDate: string, endDate: string, id: number) {
    return await this.recordCachingService.getCacheRecordsByDateRange(
      startDate,
      endDate,
      id,
    );
  }

  //최근 측정표 기반 진단내용 조회
  async getResultFromRecord(user: User) {
    const records = await this.recordCachingService.getCacheAllUsersReports(
      user.id,
    );
    const sortedRecords = records.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    const { weight, bmr, muscle, height, fat } = sortedRecords[0];
    const stdWeight = Math.pow(height / 100, 2) * 22;
    const stdMuscle = (weight * 45) / 100;
    const wetPerHgt = Math.round(weight / height);
    const stdFat =
      user.gender === '남자'
        ? Math.floor(weight * 1.1 - wetPerHgt)
        : Math.floor(weight * 1.07 - wetPerHgt);
    const resWeight =
      weight === stdWeight
        ? 0
        : weight > stdFat
        ? stdFat - weight
        : weight - stdFat;
  }
}
