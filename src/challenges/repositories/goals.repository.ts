import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Goal } from '../entities/goal.entity';
import { CreateGoalDto } from '../dto/create-goal.dto';

@Injectable()
export class GoalsRepository extends Repository<Goal> {
  constructor(private readonly dataSource: DataSource) {
    super(Goal, dataSource.createEntityManager());
  }

  // 목표 생성 (재용)
  async createGoal(Goal: CreateGoalDto): Promise<Goal> {
    const newGoal = await this.create(Goal);
    return await this.save(newGoal);
  }

  // 목표 조회 (재용)
  async getGoal(challengeId: number): Promise<Goal> {
    const goal = await this.findOne({ where: { challengeId } });
    return goal;
  }
}
