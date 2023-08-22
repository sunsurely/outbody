import { Injectable } from '@nestjs/common';
import { Report } from '../entities/report.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ReportsRepository extends Repository<Report> {
  constructor(private readonly dataSource: DataSource) {
    super(Report, dataSource.createEntityManager());
  }

  //신고기능 - 신고자: reporterId,   피신고자:reportedId
  async createReport(
    userId: number,
    commentId: number,
    description: string,
  ): Promise<Report> {
    const newReport = this.create({
      userId,
      commentId,
      description,
    });
    return await this.save(newReport);
  }
}
