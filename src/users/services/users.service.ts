import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/users/repositories/users.repository';
import {
  Injectable,
  NotFoundException,
  ConflictException,
  NotImplementedException,
  UnauthorizedException,
  NotAcceptableException,
} from '@nestjs/common';
import { UserCreateDto } from '../dto/users.create.dto';
import * as bcrypt from 'bcrypt';
import { UserUpdateDto } from '../dto/users.update.dto';
import { UserPasswordDto } from '../dto/password.update.dto';
import { BlackListRepository } from 'src/blacklists/repository/blacklist.repository';
import { FollowsRepository } from 'src/follows/repositories/follows.repository';

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
    const { name, email, password, birthday, gender, status } = user;
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
      birthday,
      gender,
      status,
    );

    return createUserResult;
  }

  //로그인 한 유저 정보조회
  async getCurrentUser(user) {
    const {
      id,
      name,
      birthday,
      email,
      gender,
      imgUrl,
      comment,
      point,
      status,
      createdAt,
    } = user;

    const usersFollows = await this.followRepository.getUsersFollow(user.id);
    console.log(usersFollows);
    return;
  }

  //사용자 정보조회
  async getUserById(userId: number) {
    const getUser = await this.usersRepository.getUserById(userId);
    if (!getUser) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    return getUser;
  }

  //유저 정보 수정
  async updateUser(userId: number, userDto: UserUpdateDto) {
    const { imgUrl, comment } = userDto;

    const updateUser = await this.usersRepository.updateUser(
      userId,
      imgUrl,
      comment,
    );

    if (!updateUser) {
      throw new NotImplementedException('업데이트에 실패했습니다');
    }
    const user = await this.usersRepository.getUserById(userId);
    const token = this.jwtService.sign({ user });

    return { updateUser, token };
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
  async deletUser(userId: number): Promise<any> {
    const result = await this.usersRepository.deleteUser(userId);

    if (!result) {
      throw new NotImplementedException('해당 작업을 완료하지 못했습니다');
    }

    return result;
  }
}
