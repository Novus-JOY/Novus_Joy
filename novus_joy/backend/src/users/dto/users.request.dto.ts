import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { Prop } from '@nestjs/mongoose';
import { User } from '../users.schema';

//interface말고 class쓰는 이유 데코레이터패턴 적용가능, 상속으로 재사용 가능
export class UserRequestDto extends PickType(User, [
  'email',
  'name',
  'password',
] as const) {}
