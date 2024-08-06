import winston from 'winston';
import { APP_DIR } from './pathes';

const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.File({
      dirname: APP_DIR,
      filename: 'error.log',
      level: 'error',
    }),
    new winston.transports.File({
      dirname: APP_DIR,
      filename: 'general.log',
      level: 'info',
    }),
  ],
});

function logError(msg: string) {
  logger.log({
    level: 'error',
    message: msg,
  });
}

function logInfo(msg: string) {
  logger.log({
    level: 'info',
    message: msg,
  });
}

export { logger, logError, logInfo };
