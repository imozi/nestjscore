import { pino, transport } from 'pino';
import { customLevels, customLevelsPretty, customLevelsColorPretty } from './const';

export const logger = pino(
  {
    name: 'LoggerService',
    customLevels,
    level: 'log',
  },
  transport({
    targets: [
      {
        target: 'pino-pretty',
        options: {
          customLevels: customLevelsPretty,
          customColors: customLevelsColorPretty,
          colorize: true,
          include: 'level,msg',
        },
      },
    ],
  }),
);
