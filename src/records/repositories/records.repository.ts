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
    bmr: number,
    weight: number,
    muscle: number,
    fat: number,
    userId: number,
    date: Date,
  ): Promise<Record> {
    const newUser = this.create({
      bmr,
      weight,
      muscle,
      fat,
      date,
      userId,
    });
    return await this.save(newUser);
  }

  //현 유저의 모든 기록 불러오기
  async getUsersRecords(id: number): Promise<Record[]> {
    return this.find({ where: { userId: id } });
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
    start: string,
    end: string,
    id: number,
  ): Promise<Record[]> {
    const startDate = new Date(start);
    const endDate = new Date(end);
    startDate.setDate(startDate.getDate() - 1);
    const records = await this.find({
      where: { date: Between(startDate, endDate), userId: id },
    });

    return records;
  }

  // 종료 1시간 내에 도전기간 내 가장 최신화되어있는 체성분 자동으로 가져와서 체성분 인증 (상우)
  // async bodyStatusRecord(): Promise<any> {
  //   const now = new Date();
  //   const oneHourAgo = new Date(now);
  //   oneHourAgo.setHours(oneHourAgo.getHours() - 1);

  //   const endChallenges = await this.challengesRepository.find({
  //     where: {
  //       endDate: LessThanOrEqual(oneHourAgo),
  //     },
  //     relations: ['challenger'],
  //   });

  //   for (const challenge of endChallenges) {
  //     const challengers = challenge.challenger;

  //     await this.entityManager.transaction(
  //       async (transactionalEntityManager) => {
  //         for (const challenger of challengers) {
  //           const userId = challenger.userId;

  //           const allRecords = await transactionalEntityManager
  //             .getRepository(Record)
  //             .createQueryBuilder('record')
  //             .where('record.userId = :userId', { userId })
  //             .getMany();

  //           return await transactionalEntityManager.save(Record, allRecords);
  //         }
  //       },
  //     );
  //   }
  // }
}
