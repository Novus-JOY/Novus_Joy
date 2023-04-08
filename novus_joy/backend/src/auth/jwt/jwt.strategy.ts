import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from './jwt.payload';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersRepository: UsersRepository) {
    console.log('asdfsadfsadf');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
  }
  //인증할 때 사용 디코딩 할 때?.

  async validate(payload: Payload) {
    console.log('asdfdafsadfsadfwefwfwef');
    const user = await this.usersRepository.findUserByIdWithoutPassword(
      payload.sub,
    );
    //디코딩된 페이로드가 적합한지
    console.log(user);
    if (user) {
      return user; // -> request.user에 user가 들어가게 된다.
    } else {
      throw new UnauthorizedException('접근 오류');
    }
  }
  //토큰을 읽고 뽑았냈다면 payload유효성 검증
}
