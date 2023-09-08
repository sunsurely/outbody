import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { BlackListRepository } from '../repository/blacklist.repository';
import { UserRepository } from 'src/users/repositories/users.repository';
import { Status } from 'src/users/userInfo';

@Injectable()
export class BlacklistsService {
  constructor(
    private readonly blacklistRepository: BlackListRepository,
    private readonly userRepository: UserRepository,
  ) {}

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
  async getAllBlacklist(status: Status, page: number, pageSize: number) {
    if (status !== 'admin') {
      throw new NotAcceptableException('해당 기능에 대한 접근권한이 없습니다.');
    }
    const blacklist = await this.blacklistRepository.getAllBlacklist();
    if (!blacklist || blacklist.length <= 0) {
      throw new NotFoundException('데이터가 존재하지 않습니다.');
    }
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    const totalPages = Math.ceil(blacklist.length / pageSize);

    const pageinatedBlacklist = blacklist.slice(startIndex, endIndex);
    return { totalPages, pageinatedBlacklist };
  }

  //관리자 권한 유저 이메일로 블랙리스트 조회
  async getBlacklistByEmail(status: Status, email: string) {
    if (status !== 'admin') {
      throw new NotAcceptableException('해당 기능에 대한 접근권한이 없습니다.');
    }

    const result = await this.blacklistRepository.getBlacklistByEmail(email);
    if (!result) {
      throw new NotFoundException('블랙리스트 유저가 아닙니다.');
    }
    return result;
  }

  // 관리자 권한 유저 강제탈퇴
  async withdrawUser(status: Status, email: string, description: string) {
    if (status !== 'admin') {
      throw new NotAcceptableException('해당 기능에 대한 접근권한이 없습니다.');
    }
    const blackEmail = await this.blacklistRepository.getBlacklistByEmail(
      email,
    );
    if (!blackEmail) {
      throw new BadRequestException(
        '해당 유저는 블랙리스트에 존재하지 않습니다.',
      );
    }

    if (!description) {
      throw new BadRequestException(
        '해당 회원의 강제탈퇴 사유를 작성해주세요.',
      );
    }
    await this.userRepository.withdrawUser(email);
  }

  // 블랙리스트에서 제거 (일반회원으로 전환)
  async removeBlacklist(status: Status, blacklistId: number) {
    if (status !== 'admin') {
      throw new NotAcceptableException('해당 기능에 대한 접근권한이 없습니다.');
    }
    return await this.blacklistRepository.removeBlacklist(blacklistId);
  }
}
