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
  // POST http://localhost:3000/follow/:id/request
  @Post('/:followId/request')
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

  // 친구 요청 전체 조회
  // GET http://localhost:3000/follow/request
  @Get('/request')
  async getUsersRequests(@Req() req: any) {
    return await this.followsService.getUsersRequests(req.user.id);
  }

  // 친구 수락 여부 결정
  // POST http://localhost:3000/follow/:id/accept
  @Post('/:followerId/accept')
  async acceptFollow(
    @Req() req: any,
    @Body() data: ResponseDto,
    @Param(
      'followerId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    followerId: number,
  ) {
    return await this.followsService.acceptFollow(
      followerId,
      req.user.id,
      data.response,
    );
  }

  // 친구 취소
  // DELETE http://localhost:3000/follow/:id
  @Delete('/:userId')
  async deleteFollow(
    @Param(
      'userId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    userId: number,
    @Req() req: any,
  ) {
    await this.followsService.deleteFollow(userId, req.user.id);
    return;
  }
}
