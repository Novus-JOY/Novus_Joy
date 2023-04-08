import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from 'src/users/users.repository';
import { LoginRequestDto } from './dto/login.request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async jwtLogin(data: LoginRequestDto) {
    const { email, password } = data;
    const user = await this.usersRepository.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('이메일과 비빌번호를 확인해주세요');
    }

    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      user.password,
    );
    if (!isPasswordValidated) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해 주세요');
    }

    const payload = { email: email, sub: user.id };
    // console.log(payload);
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
