import { LoggerService as DefaultLogerService, Injectable } from '@nestjs/common';
import { IncomingMessage, ServerResponse } from 'http';
import { logger, httpLogger, LogLevel, formatMessage, formatMessageHttp, type CombineHttp } from './lib';
import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import { ConfigService } from '../config';

dayjs.extend(duration);

@Injectable()
export class LoggerService implements DefaultLogerService {
  private readonly logger = logger;
  private readonly httpLogger = httpLogger(this.config.get('MODE'));

  constructor(private readonly config: ConfigService) {}

  info(message: string, context?: string) {
    this.logger.info(formatMessage(LogLevel.INFO, message, context));
  }

  log(message: string, context?: string) {
    this.logger.log(formatMessage(LogLevel.LOG, message, context));
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error({ trace }, formatMessage(LogLevel.ERROR, message, context));
  }

  warn(message: string, context?: string) {
    this.logger.warn(formatMessage(LogLevel.WARN, message, context));
  }

  debug(message: string, context?: string) {
    this.logger.debug(formatMessage(LogLevel.DEBUG, message, context));
  }

  http(req: IncomingMessage, res: ServerResponse, context?: string) {
    const startTime = dayjs();

    this.httpLogger(req, res);
    this.logger.req(formatMessageHttp(req as CombineHttp, context));

    res.on('finish', () => {
      const endTime = dayjs();
      res['responseTime'] = dayjs.duration(endTime.diff(startTime)).asSeconds();
      this.logger.res(formatMessageHttp(res as CombineHttp, context));
    });
  }
}
