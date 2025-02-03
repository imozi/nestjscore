export enum LogLevel {
  LOG = 'log',
  REQ = 'req',
  RES = 'res',
  INFO = 'info',
  ERROR = 'error',
  WARN = 'warn',
  DEBUG = 'debug',
}

export const customLevels = {
  log: 5,
  req: 10,
  res: 15,
  debug: 25,
  info: 30,
  warn: 40,
  error: 50,
};

export const customLevelsColor = {
  log: 'gray',
  req: 'blueBright',
  res: 'greenBright',
  debug: 'greenBright',
  info: 'cyanBright',
  warn: 'yellowBright',
  error: 'redBright',
};

export const customLevelsPretty = Object.entries(customLevels)
  .map(([key, value]) => `${key}:${value}`)
  .join(',');

export const customLevelsColorPretty = Object.entries(customLevelsColor)
  .map(([key, value]) => `${key}:${value}`)
  .join(',');
