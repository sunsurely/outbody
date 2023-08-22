import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BlackList } from '../entities/blacklist.entity';

@Injectable()
export class BlackListRepository extends Repository<BlackList> {
  constructor(private readonly dataSource: DataSource) {
    super(BlackList, dataSource.createEntityManager());
  }

  async createBlacklist(
    email: string,
    description: string,
    id: number,
  ): Promise<BlackList> {
    const newBlacklist = this.create({ email, description, userId: id });

    return await this.save(newBlacklist);
  }
}
