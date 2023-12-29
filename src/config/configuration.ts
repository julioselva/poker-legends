import * as process from 'process';

export default () => ({
  http: {
    port: process.env.PORT || 3000,
  },
  logger: {
    level: process.env.LOGGER_LEVEL || 'trace',
    pretty: String(process.env.NODE_ENV).toLowerCase() !== 'production',
  },
});
