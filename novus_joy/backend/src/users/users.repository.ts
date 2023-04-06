import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.schema';
import { UserRequestDto } from './dto/users.request.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async existsByEmail(email: string): Promise<boolean> {
    try {
      const result = await this.userModel.exists({ email });
      if (result) return true;
      else return false;
    } catch (err) {
      throw new HttpException('db error', 400);
    }
  }

  async create(user: UserRequestDto): Promise<User> {
    return await this.userModel.create(user);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const cat = await this.userModel.findOne({ email });
    return cat;
  }

  async findUserByIdWithoutPassword(userId: string): Promise<User | null> {
    const user = await this.userModel.findById(userId).select('-password');
    //패스워드 필드 빼고 가져옴 / 가져오고 싶은 것만 선택 시에는 ('name email')
    return user;
  }
}
