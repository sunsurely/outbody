import {
  Injectable,
  NotAcceptableException,
  NotImplementedException,
} from '@nestjs/common';
import { ReportsRepository } from '../repositories/reports.repository';
import { BlackListRepository } from '../../blacklists/repository/blacklist.repository';
import { Status } from 'src/users/userInfo';

@Injectable()
export class ReportsService {
  constructor(
    private readonly reportsRepository: ReportsRepository,
    private readonly blacklistRepository: BlackListRepository,
  ) {}

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

  //관리자 계정, 모든 신고기록 조회
  async getAllReports(status: Status) {
    if (status !== 'admin') {
      throw new NotAcceptableException('해당 기능에 대한 접근권한이 없습니다.');
    }

    return await this.reportsRepository.getAllReports();
  }

  //관리자 계정,  commentId에 해당하는 모든 신고기록들 조회
  async getReportsByCommentId(commentId, status) {
    if (status !== 'admin') {
      throw new NotAcceptableException('해당 기능에 대한 접근권한이 없습니다.');
    }

    return await this.reportsRepository.getReportsByCommentId(commentId);
  }
}
