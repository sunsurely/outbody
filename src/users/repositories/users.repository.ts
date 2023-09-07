import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Gender, Status } from '../userInfo';

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
    gender: string,
    birthday: string,
  ): Promise<User> {
    const newUser = this.create({
      name,
      email,
      password,
      gender: gender as Gender,
      birthday,
    });
    return await this.save(newUser);
  }

  //미들검증용 유저정보 이메일 조회
  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();

    return user;
  }

  // 사용자 정보 조회
  async getUserById(userId: number): Promise<User> {
    const user = await this.createQueryBuilder('user')
      .select([
        'user.id',
        'user.email',
        'user.name',
        'user.birthday',
        'user.gender',
        'user.imgUrl',
        'user.description',
        'user.point',
        'user.isInChallenge',
        'user.latestChallengeDate',
      ])
      .where('user.id = :id', { id: userId })
      .getOne();
    return user;
  }

  // 내 정보 수정
  async updateUser(
    userId: number,
    imgUrl: string,
    birthday: string | Date,
    description: string,
  ) {
    await this.update({ id: userId }, { imgUrl, birthday, description });

    const result = await this.findOne({ where: { id: userId } });
    return result;
  }

  // 사용자 도전 참여 여부 수정 (재용)
  async updateUserIsInChallenge(userId: number, isInChallenge: boolean) {
    const result = await this.update({ id: userId }, { isInChallenge });
    return result;
  }

  // 사용자 점수 수정 (재용)
  async updateUserPoint(userId: number, point: number) {
    const result = await this.update({ id: userId }, { point });
    return result;
  }

  //비밀번호 수정
  async updatePassword(id, newPassword) {
    const result = await this.update({ id }, { password: newPassword });
    return result;
  }

  //회원 탈퇴와 동시에 팔로우 , 팔로잉, 나의 도전 목록들 삭제
  async deleteUser(userId: number): Promise<any> {
    const deleteUserResult = await this.softDelete({ id: userId });

    return deleteUserResult;
  }

  // 유저 전체목록
  async getAllUsers(userId: number): Promise<User[]> {
    const users = await this.createQueryBuilder('user')
      .where('user.id != :userId', { userId })
      .andWhere('user.deletedAt IS NULL')
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('follow.followId')
          .from('follows', 'follow')
          .where('follow.userId = :userId')
          .getQuery();
        return `user.id NOT IN ${subQuery}`;
      })
      .getMany();

    return users;
  }

  //email로 유저 정보조회
  async getUserInfoByEmail(email: string) {
    const result = await this.findOne({
      select: ['id', 'email', 'imgUrl', 'name'],
      where: { email },
    });

    return result;
  }

  //유저 포인트 랭크 조회
  async getAllUsersForRank() {
    const result = await this.find({
      order: { point: 'DESC' },
    });
    return result;
  }

  //동일 성별, 나이대의 모든 유저 조회
  async getUsersForAverage(years: number, gender: string) {
    const result = await this.createQueryBuilder('user')
      .where('YEAR(user.birthday) = :years', { years })
      .andWhere('user.gender = :gender', { gender })
      .getMany();
    return result;
  }
}
