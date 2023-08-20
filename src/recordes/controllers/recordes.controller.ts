import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { RecordesService } from '../services/recordes.service';
import { CreateRecordDto } from '../dto/create.records.dto';

@Controller('record')
export class RecordesController {
  constructor(private readonly recordesService: RecordesService) {}

  // 측정표 기록 생성 localhost:3000/record
  @Post('/')
  async createRecord(@Body() body: CreateRecordDto, @Req() req: any) {
    return await this.recordesService.createRecord(body, req.user.id);
  }
  //모든 기록정보 불러오기 localhost:3000/record
  @Get('/')
  async getAllRecords() {
    return await this.recordesService.getAllRecords();
  }

  //기간별 기록정보 불러오기  localhost:3000/record/date?start=2023-09-01&end=2023-09-03
  @Get('/date')
  async getRecordsByDateRange(
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return await this.recordesService.getRecordsByDateRange(start, end);
  }
}
