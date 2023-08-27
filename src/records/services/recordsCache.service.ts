import {
  Injectable,
  Logger,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { Record } from '../entities/records.entity';
import { CreateRecordDto } from '../dto/create.records.dto';
import { recordCache } from '../cache/initRecord.cache';
import { RecordsRepository } from '../repositories/records.repository';

@Injectable()
export class RecordCachingService {
  private readonly logger = new Logger(RecordCachingService.name);

  constructor(private readonly recordsRepository: RecordsRepository) {}

  async setCacheRecords(body: CreateRecordDto, id: number): Promise<Record> {
    const { bmr, weight, muscle, fat, height } = body;

    const record = await this.recordsRepository.createRecord(
      id,
      bmr,
      weight,
      muscle,
      fat,
      height,
    );

    if (!record) {
      throw new NotImplementedException('기록 생성에 실패했습니다');
    }

    const userRecords = await this.recordsRepository.find({
      where: { userId: id },
    });

    if (!userRecords || userRecords.length <= 0) {
      throw new NotFoundException('기록을 불러오지 못했습니다.');
    }

    const sucessInit = recordCache.set(`record:${id}`, userRecords);

    if (sucessInit) {
      this.logger.debug('record데이터 캐싱 성공');
      return record;
    }

    this.logger.error('record 데이터 캐싱 실패');

    return record;
  }

  async getCacheAllUsersRecords(id: number): Promise<Record[]> {
    const cachedRecords: Record[] = recordCache.get(`record:${id}`);

    if (cachedRecords && cachedRecords.length > 0) {
      this.logger.debug('record 데이터 GET 성공');
      return cachedRecords;
    }

    const records = await this.recordsRepository.getUsersRecords(id);

    if (!records || records.length <= 0) {
      this.logger.error('record데이터 GET 실패');
      throw new NotFoundException('등록된 데이터가 없습니다.');
    }

    recordCache.set(`record:${id}`, records);
    this.logger.error('record 데이터 GET 실패');
    return records;
  }

  async getCacheDetailRecord(recordId, id: number): Promise<Record> {
    const cachedRecords: Record[] = recordCache.get(`record:${id}`);

    if (cachedRecords && cachedRecords.length > 0) {
      this.logger.debug('record 데이터 GET 성공');
      return cachedRecords.find((record) => record.id === recordId);
    }

    const records = await this.recordsRepository.find({
      where: { userId: id },
    });

    if (!records || records.length <= 0) {
      this.logger.error('record 데이터 GET 실패');
      throw new NotFoundException('등록된 데이터가 없습니다.');
    }

    recordCache.set(`record:${id}`, records);

    const recordDtail = await this.recordsRepository.findOne({ where: { id } });

    this.logger.error('record 데이터 GET 실패');
    return recordDtail;
  }

  async getCacheRecordsByDateRange(start: string, end: string, id: number) {
    const cachedRecords: Record[] = recordCache.get(`record:${id}`);

    const startDate = new Date(start);
    const endDate = new Date(end);
    if (cachedRecords && cachedRecords.length > 0) {
      this.logger.debug('record 데이터 GET 성공');

      const result = cachedRecords.filter((record) => {
        const cachedDate = new Date(record.createdAt);
        return cachedDate >= startDate && cachedDate <= endDate;
      });

      return result;
    }

    const records = await this.recordsRepository.getUsersRecords(id);
    recordCache.set(`record:${id}`, records);

    const recordResult = await this.recordsRepository.getRecordsByDateRange(
      start,
      end,
      id,
    );
    this.logger.error('record 데이터 GET 실패');

    return recordResult;
  }
}
