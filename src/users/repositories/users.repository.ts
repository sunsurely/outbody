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
    status: string,
  ): Promise<User> {
    const newUser = this.create({
      name,
      email,
      password,
      gender: gender as Gender,
      status: status as Status,
    });
    return await this.save(newUser);
  }

  //유저 이메일 조회
  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();

    return user;
  }

  //유저 정보조회
  async getUserById(userId: number): Promise<User> {
    const user = await this.createQueryBuilder('user')
      .select([
        'user.id',
        'user.email',
        'user.name',
        'user.birthday',
        'user.gender',
        'user.imgUrl',
        'user.comment',
        'user.point',
        'user.isInChallenge',
        'user.latestChallengeDate',
      ])
      .where('user.id = :id', { id: userId })
      .getOne();

    return user;
  }

  //유저 정보 수정
  async updateUser(
    userId: number,
    imgUrl: string,
    comment: string,
    refreshToken: string,
    birthday: string,
  ) {
    await this.update(
      { id: userId },
      { imgUrl, comment, refreshToken, birthday },
    );

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
    const deleteUserResult = await this.delete({ id: userId });

    return deleteUserResult;
  }

  // 유저 전체목록
  async getAllUsers(userId: number): Promise<User[]> {
    return this.createQueryBuilder('user')
      .where('user.id != :userId', { id: userId })
      .getMany();
  }
}
