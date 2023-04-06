import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

//보통 실패했을 때 공통된 기능 성공은 인터셉터에서
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const error = exception.getResponse() as
      | string
      | { error: string; statusCode: number; message: string | string[] };

    if (typeof error === 'string') {
      //직접 인자를 넣은 에러발생시
      response.status(status).json({
        success: false,
        timestamp: new Date().toISOString(),
        path: request.url,
        error,
      });
    } else {
      //404 nest자체에서 발생시키는 에러인 경우
      response.status(status).json({
        // statusCode: status,
        success: false,
        timestamp: new Date().toISOString(),
        path: request.url,
        ...error,
      });
    }
  }
}
