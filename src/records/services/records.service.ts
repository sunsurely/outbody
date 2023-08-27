import { Injectable, NotFoundException } from '@nestjs/common';
import { RecordCachingService } from './recordsCache.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RecordsService {
  constructor(private readonly recordCachingService: RecordCachingService) {}

  //측정기록 생성 그리고 캐싱등록
  async createRecord(body, id) {
    return await this.recordCachingService.setCacheRecords(body, id);
  }

  //누른 page에 해당하는 측정표들 pageSize개씩 조회
  async getUsersRecords(id: number, page, pageSize) {
    const usersRecords =
      await this.recordCachingService.getCacheAllUsersRecords(id);
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    const totalPages = Math.ceil(usersRecords.length / pageSize);

    const pageinatedUsersRecords = usersRecords.slice(startIndex, endIndex);

    if (pageinatedUsersRecords.length === pageSize) {
      return { pageinatedUsersRecords, totalPages };
    }

    if (
      pageinatedUsersRecords.length > 0 &&
      pageinatedUsersRecords.length < pageSize
    ) {
      return {
        pageinatedUsersRecords,
        message: '마지막 페이지입니다.',
        totalPages,
      };
    }

    if (pageinatedUsersRecords.length === 0) {
      return { message: '더이상 데이터가 없습니다.', totalPages };
    }

    return pageinatedUsersRecords;
  }

  //현 유저의 상세 기록 메모리에서 불러오기/ 캐싱된 데이터 없을 시 새롭게 세팅
  async getRecordDtail(recordId: number, id: number) {
    return await this.recordCachingService.getCacheDetailRecord(recordId, id);
  }

  //기간별 기록정보 불러오기
  async getRecordsByDateRange(
    startDate: string,
    endDate: string,
    id: number,
    page: number,
    pageSize: number,
  ) {
    const recordsResultByDate =
      await this.recordCachingService.getCacheRecordsByDateRange(
        startDate,
        endDate,
        id,
      );

    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    const totalPages = Math.ceil(recordsResultByDate.length / pageSize);

    const pageinatedUsersRecords = recordsResultByDate.slice(
      startIndex,
      endIndex,
    );

    if (pageinatedUsersRecords.length === pageSize) {
      return { pageinatedUsersRecords, totalPages };
    }

    if (
      pageinatedUsersRecords.length > 0 &&
      pageinatedUsersRecords.length < pageSize
    ) {
      return {
        data: pageinatedUsersRecords,
        message: '마지막 페이지 입니다.',
        totalPages,
      };
    }

    if (pageinatedUsersRecords.length <= 0) {
      return { message: '더이상 데이터가 없습니다.', totalPages };
    }
  }

  //최근 측정표 기반 진단내용 조회
  async getResultFromRecord(user: User) {
    const records = await this.recordCachingService.getCacheAllUsersRecords(
      user.id,
    );

    const sortedRecords = records.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    const recentRecord = sortedRecords[0];
    const { weight, muscle, height, fat } = recentRecord;
    const stdWeight = Math.round(Math.pow(height / 100, 2) * 22); //적정체중
    const stdMuscle = (weight * 45) / 100; //적정골격근량
    const wetPerHgt = weight / height;

    //성별과 키에 따른 적정 체지방량
    const stdFat =
      user.gender === '남자'
        ? Math.floor(weight * 1.1 - wetPerHgt * 128)
        : Math.floor(weight * 1.07 - wetPerHgt * 128);
    console.log(stdFat);
    //표준 체지방량 대비 증 감량 해야 할 수치
    const resFat = fat === stdFat ? 0 : stdFat - fat;

    //표준 체중 대비 증 감량 해야 할 수치계산
    const resWeight = weight === stdWeight ? 0 : stdWeight - weight;

    //표준 골격근량 대비 증량 해야 할 수치
    const resMuscle = muscle >= stdMuscle ? 0 : stdMuscle - muscle;

    return { recentRecord, resFat, resWeight, resMuscle };
  }
}
