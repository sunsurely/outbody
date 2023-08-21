import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Gender, CurrentUser } from '../userInfo';
import { Follow } from 'src/follows/entities/follow.entity';
import { Challenger } from 'src/challenges/entities/challenger.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  //회원가입
  async createUser(
    name: string,
    email: string,
    password: string,
    age: number,
    height: number,
    gender: string,
  ): Promise<User> {
    const newUser = this.create({
      name,
      email,
      password,
      age,
      height,
      gender: gender as Gender,
    });
    return await this.save(newUser);
  }

  //유저 이메일 조회
  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.findOne({
      where: { email },
    });
    return user;
  }

  //로그인한 회원 정보조회 ,
  async getCurrentUserById(userId: number): Promise<CurrentUser> {
    const queryBuilder = await this.createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.gender',
        'user.age',
        'user.height',
        'user.comment',
        'user.point',
        'user.password',
      ])
      .where('user.id = :userId', { userId })
      .leftJoinAndSelect('user.followers', 'follower')
      .leftJoinAndSelect('follower.followed', 'followed')
      .addSelect(['followed.id', 'followed.name', 'followed.imgUrl']);

    const user = await queryBuilder.getOne();

    const transformedFollowers = user.followers.map((follower) => {
      return {
        id: follower.followed.id,
        name: follower.followed.name,
        imgUrl: follower.followed.imgUrl,
      };
    });

    return {
      id: user.id,
      name: user.name,
      age: user.age,
      height: user.height,
      email: user.email,
      password: user.password,
      gender: user.gender,
      comment: user.comment,
      point: user.point,
      followers: transformedFollowers,
    };
  }

  //유저 정보조회
  async getUserById(userId: number): Promise<User> {
    const user = await this.findOne({ where: { id: userId } });

    return user;
  }

  //유저 정보 수정
  async updateUser(userId, age, height, gender, newPassword) {
    const result = await this.update(
      { id: userId },
      { age, height, gender, password: newPassword },
    );
    return result;
  }

  //회원 탈퇴와 동시에 팔로우 , 팔로잉, 나의 도전 목록들 삭제
  async deleteUser(userId: number): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    await queryRunner.manager.delete(Follow, {
      followingUserId: userId,
    });
    await queryRunner.manager.delete(Follow, {
      followedUserId: userId,
    });
    await queryRunner.manager.delete(Challenger, { userId });
    await queryRunner.manager.delete(User, { id: userId });

    await queryRunner
      .commitTransaction()
      .catch(async (error) => {
        await queryRunner.rollbackTransaction();
        throw error;
      })
      .finally(async () => {
        await queryRunner.release();
      });

    return true;
  }
}
