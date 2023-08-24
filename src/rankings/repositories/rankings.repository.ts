import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RankingsRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  // 전체 순위 조회
  async getTotalRank(): Promise<{ name: string; point: number }[]> {
    const totalRank = await this.find({
      order: { point: 'DESC' },
      select: ['name', 'point'],
    });

    return totalRank;
  }
}
