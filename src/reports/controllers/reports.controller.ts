import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ReportsService } from '../services/reports.service';
import { CreateReportDto } from '../dto/create-report.dto';
import { BlacklistDto } from '../../blacklists/dto/create-blacklist.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  //신고기능 localhost:3000/reports/:reportedUserId
  @Post('/:commentId')
  async createReport(
    @Param(
      'commentId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    commentId: number,
    @Req() req: any,
    @Body() reportDto: CreateReportDto,
  ) {
    return await this.reportsService.createReport(
      req.user.id,
      commentId,
      reportDto.description,
    );
  }

  // 관리자 계정, 모든 신고기록 조회 localhost:3000/reports
  @Get('/')
  async getAllReports(@Req() req: any) {
    const { status } = req.user.status;
    return await this.reportsService.getAllReports(status);
  }

  //관리자 계정,  commentId에 해당하는 모든 신고기록들 조회   localhost:3000/reports/:commentId
  @Get('/:commentId')
  async getReportsByCommentId(
    @Param(
      'commentId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    commentId: number,
    @Req() req: any,
  ) {
    return await this.reportsService.getReportsByCommentId(
      commentId,
      req.user.status,
    );
  }
}
