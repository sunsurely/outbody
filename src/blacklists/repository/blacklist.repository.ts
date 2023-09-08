import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BlackList } from '../../reports/entities/blacklist.entity';

@Injectable()
export class BlackListRepository extends Repository<BlackList> {
  constructor(private readonly dataSource: DataSource) {
    super(BlackList, dataSource.createEntityManager());
  }

  //관리자 권한 블랙리스트 작성
  async createBlacklist(
    email: string,
    description: string,
    id: number,
  ): Promise<BlackList> {
    const newBlacklist = this.create({ email, description, userId: id });

    return await this.save(newBlacklist);
  }

  //관리자 권한 모든 블랙리스트 조회
  async getAllBlacklist(): Promise<BlackList[]> {
    return await this.find({
      order: { createdAt: 'DESC' },
    });
  }

  //관리자 권한 유저 이메일로 블랙리스트 조회
  async getBlacklistByEmail(email: string) {
    return await this.findOne({ where: { email } });
  }

  // 블랙리스트에서 제거 (일반회원으로 전환)
  async removeBlacklist(blacklistId: number): Promise<any> {
    const deleteBlacklist = await this.delete(blacklistId);
    return deleteBlacklist;
  }

  // 블랙리스트 UserId로 추가
  async addBlacklist(userId: number, description: string): Promise<BlackList> {
    const newBlackList = this.create({ userId: userId, description });
    return newBlackList;
  }
}
