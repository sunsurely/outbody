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
import { FollowsService } from '../services/follows.service';

@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  //팔로우 , 언팔로우 기능 localhost:3000/follows/followedUserId/following
  // @Post('/:followedUserId/following')
  // // async updateFollow(
  // //   @Param(
  // //     'followedUserId',
  // //     new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
  // //   )
  // //   followedUserId: number,
  // //   @Req() req: any,
  // // ) {
  // //   return await this.followsService.updateFollow(followedUserId, req.user.id);
  // // }
}
