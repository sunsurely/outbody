import { IsDateString } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/users/repositories/users.repository';
import {
  Injectable,
  NotFoundException,
  ConflictException,
  NotImplementedException,
  UnauthorizedException,
  NotAcceptableException,
  BadRequestException,
} from '@nestjs/common';
import { UserCreateDto } from '../dto/users.create.dto';
import * as bcrypt from 'bcrypt';
import { UserUpdateDto } from '../dto/users.update.dto';
import { UserPasswordDto } from '../dto/password.update.dto';
import { BlackListRepository } from 'src/blacklists/repository/blacklist.repository';
import { FollowsRepository } from 'src/follows/repositories/follows.repository';
import { User } from '../entities/user.entity';
import { UserRecommendationDto } from '../dto/recommendation.dto';
import { SignoutDto } from '../dto/user.signout.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly blacklistRepository: BlackListRepository,
    private readonly followRepository: FollowsRepository,
    private readonly jwtService: JwtService,
  ) {}

  //회원가입  , 블랙리스트에 있을 시 가입불가
  async createUser(user: UserCreateDto) {
    const { name, email, password, gender, status } = user;
    const existUser = await this.usersRepository.getUserByEmail(email);

    if (existUser) {
      throw new ConflictException('이미 존재하는 유저입니다.');
    }

    const existBlackList = await this.blacklistRepository.getBlacklistByEmail(
      email,
    );

    if (existBlackList) {
      throw new NotAcceptableException(
        '영구삭제된 계정입니다. 해당 이메일은 아이디로 사용할 수 없습니다.',
      );
    }

    const createUserResult = await this.usersRepository.createUser(
      name,
      email,
      password,
      gender,
      status,
    );

    return createUserResult;
  }

  //사용자 정보조회
  async getUserById(userId: number) {
    const getUser = await this.usersRepository.getUserById(userId);
    if (!getUser) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    return getUser;
  }

  // 내정보 + follow정보 조회
  async getUserInfo(user) {
    const {
      password,
      provider,
      status,
      updatedAt,
      deletedAt,
      refreshToken,
      ...rest
    } = user;

    const follow = await this.followRepository.getUsersFollow(user.id);
    if (!follow) {
      throw new NotFoundException('follower가 존재하지 않습니다.');
    }

    const followersInfo = follow.map((followers) => {
      return {
        id: followers.id,
        name: followers.name,
        email: followers.email,
        imgUrl: followers.imgUrl,
      };
    });

    return { rest, followersInfo };
  }

  //유저 정보 수정
  async updateUser(userId: number, userDto: UserUpdateDto) {
    const { imgUrl, comment, birthday } = userDto;

    const newRefreshToken = this.jwtService.sign({ userId });

    const updateUser = await this.usersRepository.updateUser(
      userId,
      imgUrl,
      comment,
      newRefreshToken,
      birthday,
    );

    const { password, updatedAt, deletedAt, provider, refreshToken, ...rest } =
      updateUser;
    if (!updateUser) {
      throw new NotImplementedException('업데이트에 실패했습니다');
    }

    return { rest, newRefreshToken };
  }

  // 유저 password수정
  async updatePassword(user, passwordDto: UserPasswordDto) {
    const { password, newPassword } = passwordDto;

    const ComparedPassword = await bcrypt.compare(password, user.password);

    if (!ComparedPassword) {
      throw new UnauthorizedException('password가 일치하지 않습니다');
    }

    const update = await this.usersRepository.updatePassword(
      user.id,
      newPassword,
    );

    if (!update) {
      throw new NotImplementedException('해당 작업을 수행하지 못했습니다.');
    }
  }

  //회원탈퇴
  async deletUser(userId: number, signoutDto: SignoutDto): Promise<any> {
    const { password } = signoutDto;
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    const userPassword = user.password;

    if (!password) {
      throw new BadRequestException('비밀번호를 입력해 주세요');
    } else if (password !== userPassword) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
    const result = await this.usersRepository.deleteUser(userId);

    if (!result) {
      throw new NotImplementedException('해당 작업을 완료하지 못했습니다');
    }
    return result;
  }

  // 유저 전체목록
  async getAllUsers(userId: number): Promise<UserRecommendationDto[]> {
    const users = await this.usersRepository.getAllUsers(userId);

    if (!users) {
      throw new NotImplementedException('해당 작업을 완료하지 못했습니다');
    }
    return users.map((user) => ({
      name: user.name,
      email: user.email,
      imgUrl: user.imgUrl,
    }));
  }
}
