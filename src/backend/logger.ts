import winston from 'winston';
import { APP_DIR } from './pathes';

const { combine, timestamp, label, prettyPrint } = winston.format;

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      dirname: APP_DIR,
      filename: 'error.log',
      level: 'error',
      format: combine(
        label({ label: 'right meow!' }),
        timestamp()
        // prettyPrint()
      ),
    }),
    new winston.transports.File({
      dirname: APP_DIR,
      filename: 'general.log',
      level: 'info',
      format: combine(
        label({ label: 'right meow!' }),
        timestamp()
        // prettyPrint()
      ),
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
