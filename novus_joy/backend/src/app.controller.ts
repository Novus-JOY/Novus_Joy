import {
  Controller,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PositiveIntPipe } from './common/pipes/positiveInt.pipe';
import { SuccessInterceptor } from './common/interceptors/success.interceptor';
import { ApiOperation } from '@nestjs/swagger';

//데코레이터로 헤더/상태코드등 설정 가능

@Controller()
@UseFilters(HttpExceptionFilter)
@UseInterceptors(SuccessInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    throw new HttpException('api broken', 401);
    return 'get';
  }
  @ApiOperation({ summary: 'test' })
  @Get(':id') //pipe가 문자가 오면 validationError도 내준다.
  getOneCat(@Param('id', ParseIntPipe, PositiveIntPipe) id: number) {
    return 'id';
  }
}
