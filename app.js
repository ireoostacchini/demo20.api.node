const express = require('express');
const pino = require('pino');
const expressPino = require('express-pino-logger');
const { v4: uuidv4 } = require('uuid');
const config = require('./config');
const errorHandler = require('./app/errorHandler');
const AppError = require('./app/errors/AppError');

//## Separate Express 'app' and 'server' - const app = express(); should be in app.js
const app = express();

//## Don't route logs within the app -  write logs to stdout using a logger utility and then let the execution environment (container, server, etc.) pipe the stdout stream to the appropriate destination (i.e. Splunk, Graylog, ElasticSearch, etc.).
//  use a mature logging tool like Pino or Log4js
//https://www.twilio.com/blog/guide-node-js-logging
const pinoLogger = pino({
  level: config.settings.logLevel,
});

const expressLogger = expressPino({
  pinoLogger,
  reqCustomProps: (req) => {
    return { traceId: setTraceId(req) };
  },
});

//## Assign a transaction id to each log statement - or create one if not supplied
//https://github.com/pinojs/pino-http#pinohttpopts-stream
const setTraceId = (req) => {
  const traceId = req.header('X-Request-Id') || uuidv4();

  //we set this on the req, so the controllers can pass it deeper into the app if need be
  req.traceId = traceId;

  return traceId;
};

const logger = expressLogger.logger;

//we shouldn't have to do this - we set the level earlier
//but we do have to, and it does work
logger.level = config.settings.logLevel;

module.exports = require('./app/express')(app, config, expressLogger);

//## It is not safe to resume normal operation after 'uncaughtException'. Restart the process carefully using a process management tool like PM2
//https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly
process.on('uncaughtException', (err) => {
  errorHandler.handleError(err, logger);

  process.exit(-1);
});

//## Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(-1);
});

app.listen(config.settings.port, () => {
  logger.info('Express server listening on port ' + config.settings.port);
});
