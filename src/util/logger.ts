/* eslint-disable no-console */
import config from '../config';

const noop = () => {};

const prodModeLogger = {
  log: noop,
  info: noop,
  error: noop,
  warn: noop,
  debug: noop,
};
const devModeLogger = {
  log: (...args: unknown[]) => console.log(...args),
  info: (...args: unknown[]) => console.info(...args),
  error: (...args: unknown[]) => console.error(...args),
  warn: (...args: unknown[]) => console.warn(...args),
  debug: (...args: unknown[]) => console.debug(...args),
};

const logger = config.isDevelopmentEnv ? devModeLogger : prodModeLogger;

export default logger;
