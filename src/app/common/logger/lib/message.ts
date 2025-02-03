import * as chalk from 'chalk';
import * as dayjs from 'dayjs';
import { IncomingMessage, ServerResponse } from 'http';
import { LogLevel, customLevelsColor } from './const';

interface ServerResponseWithTime extends ServerResponse {
  responseTime: number;
}

export type CombineHttp = IncomingMessage & ServerResponseWithTime;

const timestamp = () => {
  return chalk.white(dayjs().format('YYYY-MM-DD HH:mm:ss'));
};

const baseMessage = (context: string) =>
  `${chalk.gray('[Nest]')} ${chalk.gray(process.pid)} ${timestamp()} [${chalk.yellowBright(context)}]`;

export const formatMessage = (level: LogLevel, message: string, context: string = 'NestApplication'): string => {
  return `${baseMessage(context)} ${chalk[customLevelsColor[level]](message)}`;
};

export const formatMessageHttp = (http: CombineHttp, context: string = 'NestApplication'): string => {
  const url = http.req ? http.req.url : http.url;
  const httpMessage = (msg: string) =>
    `${baseMessage(context)}[${chalk.greenBright(http.method ? http.method : http.req.method)}] ${chalk.gray(msg)}`;

  const colorizeStatus = (status: number) => {
    switch (true) {
      case status >= 400 && status < 500:
        return chalk.yellowBright(status);
      case status >= 300 && status < 400:
        return chalk.blueBright(status);
      case status >= 500:
        return chalk.redBright(status);
      default:
        return chalk.greenBright(status);
    }
  };

  if (http.req && http.responseTime) {
    return httpMessage(`[${colorizeStatus(http.statusCode)}] ${url} duration: ${http.responseTime}s`);
  }

  return httpMessage(`${url}`);
};
