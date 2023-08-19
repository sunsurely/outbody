import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Gender } from './userInfo';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}
  async createUser(
    email: string,
    name: string,
    password: string,
    age: number,
    gender: string,
    height: number,
  ) {
    try {
      const encryptedPassword = await bcrypt.hash(password, 15);
      const existUser = await this.usersRepository.findOne({
        where: { email },
      });
      if (existUser) {
        throw Error('이미 존재하는 사용자입니다.');
      }
      const user = new UserEntity();
      user.name = name;
      user.email = email;
      user.password = encryptedPassword;
      user.age = age;
      user.gender = gender as Gender;
      user.height = height;

      const createUserResult = await this.usersRepository.save(user);
      return createUserResult;
    } catch (e) {
      throw e;
    }
  }

  async getUserInfo(email: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { email },
      });
      if (!user) {
        throw new NotFoundException('유저가 존재하지 않습니다.');
      }

      return user;
    } catch (err) {
      throw err;
    }
  }
}
