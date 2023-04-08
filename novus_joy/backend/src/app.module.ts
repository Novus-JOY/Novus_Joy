import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import * as mongoose from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(), //글로벌 사용시 인자로 {isGlobal: true}
    UsersModule,
    MongooseModule.forRoot(process.env.MONGODB_URI),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  private readonly isDev: boolean = process.env.MODE === 'dev' ? true : false;
  configure(consumer: MiddlewareConsumer) {
    console.log('middleware');
    consumer.apply(LoggerMiddleware).forRoutes('*');
    mongoose.set('debug', this.isDev);
    //consumer(소비자)에게 로거미들웨어(provider)가 미들웨어(제품)를 제공해준다.
  }
}
