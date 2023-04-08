import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    //비포는 보통 미들웨어에서 처리한다.

    const now = Date.now();
    return next.handle().pipe(
      //보통 데이터 가공 시에 필터처럼 사용 많이 함
      //컨트롤러에서return한 값을 받음
      map((data) => ({
        success: true,
        data,
      })),
    );
  }
}
