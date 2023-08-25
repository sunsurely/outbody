import {
  Controller,
  Param,
  ParseIntPipe,
  HttpStatus,
  Req,
  Post,
  Body,
  Get,
  Delete,
} from '@nestjs/common';
import { FollowsService } from '../services/follows.service';
import { ResponseDto } from '../dto/response.dto';

@Controller('follow')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  // 친구 요청
  // POST http://localhost:3000/follow/request/folowerId
  @Post('/request/:followId')
  async requestFollow(
    @Param(
      'followId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    followId: number,
    @Req() req: any,
  ) {
    return await this.followsService.requestFollow(followId, req.user);
  }

  // 친구 요청 메시지 전체 조회
  // GET http://localhost:3000/follow/request
  @Get('/request')
  async getUsersRequests(@Req() req: any) {
    return await this.followsService.getUsersRequests(req.user.id);
  }

  // 친구 수락여부 결정 data.response의  yes or no 여부로 수락 or 취소 결정
  // POST http://localhost:3000/follow/userId/accept
  @Post('/:userId/accept')
  async acceptFollow(
    @Req() req: any,
    @Body() data: ResponseDto,
    @Param(
      'userId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    userId: number,
  ) {
    return await this.followsService.acceptFollow(
      userId,
      req.user.id,
      data.response,
    );
  }

  // 친구 취소, follow 삭제
  // DELETE http://localhost:3000/follow/userId
  @Delete('/:userId')
  async deleteFollow(
    @Param(
      'userId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    userId: number,
    @Req() req: any,
  ) {
    return await this.followsService.deleteFollow(userId, req.user.id);
  }
}
