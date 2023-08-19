import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UserCreateDto } from './dto/users.create.dto';
import { UserService } from './users.service';
import { User } from './entities/user.entity';
import { CurrentUser } from 'src/common/user.decorators';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async createUser(@Body() usersDto: UserCreateDto) {
    const createUserResult = await this.userService.createUser(usersDto);
    return createUserResult;
  }

  @Get('/me')
  async getCurrentUser(@CurrentUser() user: User) {
    return user;
  }

  @Get('/:userId')
  async getUserById(
    @Param(
      'userId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    userId: number,
  ) {
    const getUserInfoResult = await this.userService.getUserById(userId);
    return getUserInfoResult;
  }
}
