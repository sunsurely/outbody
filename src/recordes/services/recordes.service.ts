import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { RecordsRepository } from '../repositories/recordes.repository';

@Injectable()
export class RecordesService {
  constructor(private readonly recordsRepository: RecordsRepository) {}

  //측정기록 생성
  async createRecord(body, id) {
    const record = await this.recordsRepository.createRecord(body, id);
    if (!record) {
      throw new NotImplementedException('기록 생성에 실패했습니다');
    }

    return record;
  }

  //모든 기록정보 불러오기
  async getAllRecords() {
    const result = await this.recordsRepository.getAllRecords();

    if (!result || result.length <= 0) {
      throw new NotFoundException('등록된 데이터가 없습니다');
    }

    return result;
  }

  //기간별 기록정보 불러오기
  async getRecordsByDateRange(start: string, end: string) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const getRecords = await this.recordsRepository.getRecordsByDateRange(
      startDate,
      endDate,
    );
    if (!getRecords || getRecords.length <= 0) {
      throw new NotFoundException('데이터 조회에 실패했습니다.');
    }

    return getRecords;
  }
}
