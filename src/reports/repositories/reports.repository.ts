import { Injectable, Query } from '@nestjs/common';
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

  //관리자 계정, 모든 신고기록 조회 getAllReports
  async getAllReports(): Promise<Report[]> {
    const query = `
    SELECT
      report.id AS report_id,
      report.description AS report_description,
      report.commentId AS report_commentId,
      report.createdAt AS report_createdAt,
      comment.comment AS comment_comment
    FROM
      reports AS report
    LEFT JOIN
      comments AS comment ON report.commentId = comment.id
    WHERE
      report.deletedAt IS NULL;
  `;
    const reports = await this.query(query);
    return reports;
  }

  //관리자 계정,  commentId에 해당하는 모든 신고기록들 조회
  async getReportsByCommentId(commentId): Promise<Report[]> {
    return await this.find({ where: { commentId } });
  }
}
