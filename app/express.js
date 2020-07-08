'use strict';
const methodOverride = require('method-override');
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const controllers = require('./controllers');
const business = require('./business');
const db = require('./db');
const api = require('./api');
const errorHandler = require('./errorHandler');
const NotFoundError = require('./errors/NotFoundError');
const errorMapper = require('./mappers/errorMapper');
const swagger = require('swagger-spec-express');
const swaggerManager = require('./swaggerManager');
const errorDtoCodes = require('./constants/errorDtoCodes');
const ErrorDto = require('./dto/errorDto');

module.exports = (app, config, expressLogger) => {
  //## Limit concurrent requests (eg express-rate-limit)
  //https://www.npmjs.com/package/express-rate-limit
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10,
    delayMs: 0, // disabled
    message: {
      error: new ErrorDto(
        errorDtoCodes.tooManyRequests,
        400,
        "'You have exceeded the no. of requests allowed in a specific timeframe. Please wait, and then try again.'"
      ),
    },
  });

  //## Adjust the allowed HTTP response headers for enhanced security
  app.use(helmet());
  app.use(expressLogger);
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  if (process.env.NODE_ENV === 'production') {
    app.use(limiter);
  }
  app.use('/api', router);

  //we must swaggerise the router before we pass it in to controllers.registerRoutes
  swagger.swaggerize(router);

  //and of course we must register the routes before we finish the swagger setup
  controllers.registerRoutes(router, business, db, api, expressLogger.logger);

  swaggerManager.setupSwagger(app);

  //set api base path in router
  app.use('/api', router);

  //## if no route match is found, forward a 404 error to the error handler
  app.use((req, res, next) => {
    const err = new NotFoundError('Not Found');
    err.status = 404;
    next(err);
  });

  //the error handler must be last, after  app.use("/api", router), otherwise the default html error handler is used
  //https://expressjs.com/en/guide/error-handling.html

  app.use((err, req, res, next) => {
    errorHandler.handleError(err, expressLogger.logger);

    const errorDto = errorMapper.modelToDto(err);

    res.status(errorDto.status).send({
      error: errorDto,
    });
  });

  return app;
};
