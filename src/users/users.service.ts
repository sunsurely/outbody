import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UserRepository } from './users.repository';
import { UserCreateDto } from './dto/users.create.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly usersRepository: UserRepository) {}

  async createUser(user: UserCreateDto) {
    const { name, email, password, age, height, gender } = user;
    const existUser = await this.usersRepository.getUserByEmail(email);

    if (existUser) {
      throw new ConflictException('이미 존재하는 유저입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 15);

    const createUserResult = await this.usersRepository.createUser(
      name,
      email,
      hashedPassword,
      age,
      height,
      gender,
    );

    return createUserResult;
  }

  async getUserById(userId: number) {
    const getUser = await this.usersRepository.getUserById(userId);
    if (!getUser) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    return getUser;
  }
}
