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

  //현 유저의 모든 기록 불러오기 localhost:3000/record
  @Get('/')
  async getUsersRecords(@Req() req: any) {
    return await this.recordesService.getUsersRecords(req.user.id);
  }

  //현 유저의 상세 기록 불러오기 localhost:3000/record/:recordId
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

  //기간별 기록정보 불러오기  localhost:3000/record/date?start=2023-09-01&end=2023-09-03
  @Get('/date')
  async getRecordsByDateRange(
    @Query('start') start: string,
    @Query('end') end: string,
    @Req() req: any,
  ) {
    return await this.recordesService.getRecordsByDateRange(
      start,
      end,
      req.user.id,
    );
  }
}
