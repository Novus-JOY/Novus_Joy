import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users.schema';
import { Model } from 'mongoose';
import { UserRequestDto } from '../dto/users.request.dto';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly UsersRepository: UsersRepository) {}

  async uploadImg(user: User, files: Express.Multer.File[]) {
    const fileName = `users/${files[0].filename}`;
    console.log(fileName);
    const newUser = await this.UsersRepository.findByIdAndUpdateImg(
      user.id,
      fileName,
    );
    console.log(newUser);
    return newUser;
  }
  async signUp(body: UserRequestDto) {
    const { email, name, password } = body;
    const isUserExist = await this.UsersRepository.existsByEmail(email);

    if (isUserExist) {
      throw new UnauthorizedException('해당하는 아이디가 이미 존재합니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.UsersRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    return user.readOnlyData; //schema에서 virtual필드를 만들어서 사용가능
  }
}
