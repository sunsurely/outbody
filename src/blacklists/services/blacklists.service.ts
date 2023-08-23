import { Injectable, NotAcceptableException } from '@nestjs/common';
import { BlackListRepository } from '../repository/blacklist.repository';
import { Status } from 'src/users/userInfo';

@Injectable()
export class BlacklistsService {
  constructor(private readonly blacklistRepository: BlackListRepository) {}

  //관리자 권한 블랙리스트 작성
  async createBlacklist(
    email: string,
    description: string,
    id: number,
    status: string,
  ) {
    if (status !== 'admin') {
      throw new NotAcceptableException('해당 기능에 대한 접근권한이 없습니다.');
    }

    return await this.blacklistRepository.createBlacklist(
      email,
      description,
      id,
    );
  }

  //관리자 권한 모든 블랙리스트 조회
  async getAllBlacklist(status: Status) {
    if (status !== 'admin') {
      throw new NotAcceptableException('해당 기능에 대한 접근권한이 없습니다.');
    }

    return await this.blacklistRepository.getAllBlacklist();
  }

  //관리자 권한 유저 이메일로 블랙리스트 조회
  async getBlacklistByEmail(status: Status, email: string) {
    if (status !== 'admin') {
      throw new NotAcceptableException('해당 기능에 대한 접근권한이 없습니다.');
    }

    return await this.blacklistRepository.getBlacklistByEmail(email);
  }
}
