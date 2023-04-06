import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';
import { IsNotEmpty, IsString } from 'class-validator';
import { Document, HydratedDocument, SchemaOptions } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class User extends Document {
  @ApiProperty({
    example: '96tmdqh@naver.com',
    description: 'email',
    required: true,
  })
  @Prop({
    required: true,
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '한승보',
    description: 'name',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  // @IsString({message : "올바른 형식으로 작성해주세요"}) 와 같이 에러 메세지 또한 작성할 수 있습니다.
  //이처럼 사용자 편의에 맞게 에러를 핸들링하기 위함 + 최종 DB에서 에러 핸들링 전에 한 번 더 검사  + 다른 속성과 같은 레이어에서 검사하기 위함
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '23810',
    description: 'password',
    required: true,
  })
  @Prop({
    required: true,
  })
  password: string;
  @Prop()
  @IsString()
  imgUrl: string;

  readonly readOnlyData: { id: string; email: string; name: string };
}

export const UserSchema = SchemaFactory.createForClass(User);

//벌츄얼 필드 : 실제 db에 저장되는 필드는 아니지만 비즈니스로직에서 사용할 수 있도록 도와주는 필드
UserSchema.virtual('readOnlyData').get(function (this: User) {
  return {
    id: this.id,
    email: this.email,
    name: this.name,
  };
});
