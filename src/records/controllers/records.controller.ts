import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { RecordsService } from '../services/records.service';
import { CreateRecordDto } from '../dto/create.records.dto';

@Controller('record')
export class RecordsController {
  constructor(private readonly recordesService: RecordsService) {}

  // 측정표 기록 생성
  // POST http://localhost:3000/record
  @Post('/')
  async createRecord(@Body() body: CreateRecordDto, @Req() req: any) {
    return await this.recordesService.createRecord(body, req.user.id);
  }

  //누른 page에 해당하는 측정표들 pageSize개씩 조회
  // GET http://localhost:3000/record/?page=page&pageSize=pageSize
  @Get('/page')
  async getUsersRecords(
    @Req() req: any,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.recordesService.getUsersRecords(
      req.user.id,
      page,
      pageSize,
    );
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
  // GET http://localhost:3000/record/date/period/page/?page=page&pageSize=pageSize&start=start&end=end
  @Get('/date/period/page')
  async getRecordsByDateRange(
    @Req() req: any,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return await this.recordesService.getRecordsByDateRange(
      start,
      end,
      req.user.id,
      page,
      pageSize,
    );
  }

  //최근 측정표 기반 진단내용 조회
  // GET http://localhost:3000/record/result/detail
  @Get('/result/detail')
  async getResultFromRecord(@Req() req: any) {
    return await this.recordesService.getResultFromRecord(req.user);
  }
}
