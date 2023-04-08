import {
  Body,
  Controller,
  Post,
  Get,
  UseFilters,
  UseInterceptors,
  UseGuards,
  Req,
  HttpException,
  UploadedFiles,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UserRequestDto } from '../dto/users.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReadOnlyUserDto } from '../dto/users.dto';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { LoginRequestDto } from 'src/auth/dto/login.request.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { Request } from 'express';
import { CurrentUser } from 'src/common/decorators/user.decorators';
import { User } from '../users.schema';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils/multer.options';

@Controller('users')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(SuccessInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @ApiResponse({
    status: 500,
    description: 'server Error',
  })
  @ApiResponse({
    status: 200,
    description: '성공!',
    type: ReadOnlyUserDto,
  })
  @ApiOperation({ summary: '회원가입' })
  @Post()
  async signUp(@Body() body: UserRequestDto) {
    console.log(body);
    return await this.usersService.signUp(body);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  login(@Body() data: LoginRequestDto) {
    return this.authService.jwtLogin(data);
  }

  @ApiOperation({ summary: '현재 유저 가져오기' })
  @UseGuards(JwtAuthGuard) //guard주입 -> strategy의 validate실행
  @Get('/relogin')
  getCurrentUser(@CurrentUser() user: User) {
    console.log('users');
    return user.readOnlyData;
  }

  @ApiOperation({ summary: '유저 프로필 이미지 업로드' })
  @UseInterceptors(FilesInterceptor('image', 10, multerOptions('users')))
  //multerOptions는 각 api마다 다른 폴더에 저장하기 위해 폴더명을 인수로 받는다.
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  uploadUserImg(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() user: User,
  ) {
    console.log('Usercontroller files', files);
    return this.usersService.uploadImg(user, files);
  }
}
