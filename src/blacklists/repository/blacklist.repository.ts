import { Injectable } from '@nestjs/common';
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
  async getAllBlacklist() {
    return await this.find();
  }

  //관리자 권한 유저 이메일로 블랙리스트 조회

  async getBlacklistByEmail(email: string) {
    return await this.findOne({ where: { email } });
  }
}
