import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Gender } from './userInfo';
import { UserUpdateDto } from './dto/users.update.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

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

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.findOne({
      where: { email },
    });
    return user;
  }

  async getUserById(userId: number): Promise<User | null> {
    const user = await this.findOne({
      where: { id: userId },
    });
    return user;
  }

  async updateUser(user: User, data: Partial<UserUpdateDto>): Promise<object> {
    const result = await this.update({ id: user.id }, data);
    return result;
  }

  async findByIdAndUpdateImage(id: number, key: string): Promise<string> {
    const user = await this.findOne({ where: { id } });
    user.imgUrl = key;
    const newUser = await this.save(user);
    return newUser.imgUrl;
  }

  async getUserImageUrl(id: number): Promise<string> {
    const user = await this.findOne({ where: { id } });
    return user.imgUrl;
  }

  async deleteUser(id: number): Promise<object> {
    const result = await this.delete({ id: id });
    return result;
  }
}
