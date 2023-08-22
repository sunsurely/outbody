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
    reportedUserId: number,
    @Req() req: any,
    @Body() reportDto: CreateReportDto,
  ) {
    return await this.reportsService.createReport(
      reportedUserId,
      req.user.id,
      reportDto.description,
    );
  }
}
