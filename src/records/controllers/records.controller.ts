import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { RecordsService } from '../services/records.service';
import { CreateRecordDto } from '../dto/create.records.dto';
import { RangeRecordDto } from '../dto/range.records.dto';

@Controller('record')
export class RecordsController {
  constructor(private readonly recordesService: RecordsService) {}

  // 측정표 기록 생성
  // POST http://localhost:3000/record
  @Post('/')
  async createRecord(@Body() body: CreateRecordDto, @Req() req: any) {
    return await this.recordesService.createRecord(body, req.user.id);
  }

  // 현 유저의 모든 기록 불러오기
  // GET http://localhost:3000/record
  @Get('/')
  async getUsersRecords(@Req() req: any) {
    return await this.recordesService.getUsersRecords(req.user.id);
  }

  // 현 유저의 상세 기록 불러오기
  // GET http://localhost:3000/record/:recordId
  @Get('/:recordId')
  async getRecordDtail(
    @Param(
      'recordId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    recordId: number,
    @Req() req: any,
  ) {
    return await this.recordesService.getRecordDtail(recordId, req.user.id);
  }

  // 기간별 기록정보 불러오기
  // GET http://localhost:3000/record/date
  @Get('/date/period')
  async getRecordsByDateRange(@Body() date: RangeRecordDto, @Req() req: any) {
    return await this.recordesService.getRecordsByDateRange(
      date.start,
      date.end,
      req.user.id,
    );
  }

  //최근 측정표 기반 진단내용 조회
  // GET http://localhost:3000/record/result
  @Get('/result')
  async getResultFromRecord(@Req() req: any) {
    return await this.getResultFromRecord(req.user);
  }
}
