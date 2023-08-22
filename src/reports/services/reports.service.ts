import { Injectable, NotImplementedException } from '@nestjs/common';
import { ReportsRepository } from '../repositories/reports.repository';

@Injectable()
export class ReportsService {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  //신고기능 - 신고자: userId,
  async createReport(userId: number, commentId: number, description: string) {
    const reportResult = await this.reportsRepository.createReport(
      userId,
      commentId,
      description,
    );

    if (!reportResult) {
      throw new NotImplementedException('요청한 기능을 수행하지 못했습니다');
    }

    return reportResult;
  }
}
