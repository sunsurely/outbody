import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { RecordsRepository } from '../repositories/records.repository';
import { Record } from '../entities/records.entity';
import { UserRepository } from 'src/users/repositories/users.repository';

@Injectable()
export class RecordsService {
  constructor(
    private readonly recordsRepository: RecordsRepository,
    private readonly userRepository: UserRepository,
  ) {}

  //측정기록 생성
  async createRecord(body, id): Promise<Record> {
    const { bmr, weight, muscle, fat, height } = body;

    const newRecord = await this.recordsRepository.createRecord(
      id,
      bmr,
      weight,
      muscle,
      fat,
      height,
    );

    if (!newRecord) {
      throw new NotImplementedException('기록 생성에 실패했습니다');
    }

    return await newRecord;
  }

  //누른 page에 해당하는 측정표들 pageSize개씩 조회
  async getUsersRecords(id: number, page, pageSize) {
    const usersRecords = await this.recordsRepository.getUsersRecords(id);

    if (!usersRecords || usersRecords.length <= 0) {
      throw new NotFoundException('데이터가 존지하지 않습니다.');
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    const totalPages = Math.ceil(usersRecords.length / pageSize);

    const pageinatedUsersRecords = usersRecords.slice(startIndex, endIndex);

    return { totalPages, pageinatedUsersRecords };
  }

  //현 유저의 상세 기록 조회
  async getRecordDtail(recordId: number) {
    return await this.recordsRepository.getRecordDeTail(recordId);
  }

  //기간별 기록정보 불러오기
  async getRecordsByDateRange(
    start: string,
    end: string,
    id: number,
    page: number,
    pageSize: number,
  ) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59);

    const usersRecords = await this.recordsRepository.getRecordsByDateRange(
      startDate,
      endDate,
      id,
    );

    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    const totalPages = Math.ceil(usersRecords.length / pageSize);
    const pageinatedUsersRecords = usersRecords.slice(startIndex, endIndex);

    return { pageinatedUsersRecords, totalPages };
  }

  //최근 측정표 기반 진단내용 조회
  async getResultFromRecord(user: User) {
    const recentRecords = await this.recordsRepository.getLatestUserRecord(
      user.id,
    );

    if (!recentRecords) {
      throw new NotFoundException('등록된 데이터가 없습니다.');
    }
    const years = new Date(user.birthday).getFullYear();

    const sameUsers = await this.userRepository.getUsersForAverage(
      years,
      user.gender,
    );
    const avgDatas: { avgWgt: number; avgFat: number; avgMus: number } = {
      avgWgt: 0,
      avgFat: 0,
      avgMus: 0,
    };

    if (sameUsers.length > 0) {
      const ids = sameUsers.map((y) => y.id);
      const records = await this.recordsRepository.getRecordForAverage(ids);

      const avgRecords = [];
      let currentUser = null;
      for (const record of records) {
        if (record.userId !== currentUser) {
          avgRecords.push(record);
          currentUser = record.userId;
        }
      }

      const totalNum = avgRecords.length;
      let totalWgt: number = 0;
      let totalFat: number = 0;
      let totalMus: number = 0;

      for (const rec of avgRecords) {
        totalWgt += rec.weight;
        totalFat += rec.fat;
        totalMus += rec.muscle;
      }

      const avgWgt = parseInt((totalWgt / totalNum).toFixed(1));
      const avgFat = parseInt((totalFat / totalNum).toFixed(1));
      const avgMus = parseInt((totalMus / totalNum).toFixed(1));
      avgDatas.avgWgt = avgWgt;
      avgDatas.avgFat = avgFat;
      avgDatas.avgMus = avgMus;
    }

    const { weight, muscle, height, fat } = recentRecords;
    const stdWeight = Math.round(Math.pow(height / 100, 2) * 22); //적정체중
    const stdMuscle = (weight * 45) / 100; //적정골격근량
    const wetPerHgt = weight / height;

    //성별과 키에 따른 적정 체지방량
    const stdFat =
      user.gender === '남자'
        ? Math.floor(weight * 1.1 - wetPerHgt * 128)
        : Math.floor(weight * 1.07 - wetPerHgt * 128);

    //표준 체지방량 대비 증 감량 해야 할 수치
    const resFat = fat === stdFat ? 0 : stdFat - fat;

    //표준 체중 대비 증 감량 해야 할 수치계산
    const resWeight = weight === stdWeight ? 0 : stdWeight - weight;

    //표준 골격근량 대비 증량 해야 할 수치
    const resMuscle = muscle >= stdMuscle ? 0 : stdMuscle - muscle;

    return {
      recentRecords,
      avgDatas,
      resFat,
      resWeight,
      resMuscle,
      stdFat,
      stdMuscle,
      stdWeight,
    };
  }
}
