import {
  Controller,
  Patch,
  Param,
  ParseIntPipe,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { FollowsService } from '../services/follows.service';

@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  //친구추가 , 친구삭제 기능 localhost:3000/follows/followedUserId/following
  @Patch('/:followId/following')
  async updateFollow(
    @Param(
      'followId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    followId: number,
    @Req() req: any,
  ) {
    return await this.followsService.updateFollow(followId, req.user.id);
  }
}
