import { Injectable } from '@nestjs/common';
import { Report } from '../entities/report.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ReportsRepository extends Repository<Report> {
  constructor(private readonly dataSource: DataSource) {
    super(Report, dataSource.createEntityManager());
  }

  //신고기능 - 신고자: userId
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

  //관리자 계정, 모든 신고기록 조회
  async getAllReports(): Promise<any[]> {
    const reports = await this.createQueryBuilder('report')
      .leftJoin(Comment, 'comment', 'comment.id = report.commentId')
      .orderBy('report.createdAt', 'DESC')
      .select([
        'report.id',
        'report.description',
        'comment.comment',
        'comment.createdAt',
      ])
      .getMany();

    console.log('reports', reports);
    return reports;
  }

  //관리자 계정,  commentId에 해당하는 모든 신고기록들 조회
  async getReportsByCommentId(commentId): Promise<Report[]> {
    return await this.find({ where: { commentId } });
  }
}
