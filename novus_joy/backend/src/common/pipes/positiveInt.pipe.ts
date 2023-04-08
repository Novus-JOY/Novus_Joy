//:id를 무조건 정수로 변환
import { HttpException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PositiveIntPipe implements PipeTransform {
  transform(value: number) {
    console.log('positiveIntPipe', value);
    if (value < 0) {
      throw new HttpException('value > 0', 400);
    }
    return value;
  }
}
