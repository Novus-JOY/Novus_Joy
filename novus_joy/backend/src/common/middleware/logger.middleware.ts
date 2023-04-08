import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  use(req: Request, res: Response, next: NextFunction) {
    console.log('logger log');
    this.logger.log(`${req.ip}, ${req.method}, ${req.originalUrl}`);
    res.on('finish', () => {
      this.logger.log(
        `${req.ip}, ${req.method}, ${res.statusCode}, ${req.originalUrl}`,
      );
    });
    next();
  }
}
