import { Injectable } from '@nestjs/common';

@Injectable() //의존성 주입이 가능하다는 뜻 / 의존성 주입 패턴 : 공급자(provider) 역할 -> 제품(서비스)을 소비자(컨트롤러)에게 넘긴다.
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
