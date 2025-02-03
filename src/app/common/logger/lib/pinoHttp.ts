import { isDev } from '@/shared/helpers';
import { pinoHttp } from 'pino-http';

export const httpLogger = (mode?: string) =>
  pinoHttp({
    name: 'HTTPLoggerService',
    base: null,
    autoLogging: !isDev(mode),
    level: 'error',
    formatters: {
      level(label) {
        return { level: label };
      },
    },
    customLogLevel: function (req, res, err) {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return 'warn';
      } else if (res.statusCode >= 500 || err) {
        return 'error';
      } else if (res.statusCode >= 300 && res.statusCode < 400) {
        return 'silent';
      }
      return 'info';
    },
    genReqId: () => null,
    transport: {
      target: 'pino/file',
      options: { destination: './logs/nest-http.log', ignore: 'hostname' },
    },
  });
