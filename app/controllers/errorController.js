var swagger = require('swagger-spec-express');

//this controller allows us to test errors
const AppError = require('../errors/AppError');
const BadRequestError = require('../errors/BadRequestError');
const MyCustomError = require('../errors/MyCustomError');
const business = require('../business');
const db = require('../db');
const api = require('../api');

//until we have a proper async function
const myAsyncFunction = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new AppError('async error - internal error'));
    }, 1000);
  });
};
const myAsyncBadRequestFunction = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new BadRequestError('async error - bad request'));
    }, 1000);
  });
};

const testController = (() => {
  registerRoutes = (router, business, db, api) => {
    router
      .get('/errors/fail400', function (req, res, next) {
        try {
          throw new BadRequestError('no good - bad request');
        } catch (err) {
          next(err);
        }
      })
      .describe({
        responses: {
          400: {
            description: 'error',
            model: 'errorResponse',
          },
        },
      });

    router
      .get('/errors/failcustom', function (req, res, next) {
        try {
          throw new MyCustomError('custom error');
        } catch (err) {
          next(err);
        }
      })
      .describe({
        responses: {
          500: {
            description: 'error',
            model: 'errorResponse',
          },
        },
      });

    router
      .get('/errors/fail500', function (req, res, next) {
        try {
          throw new AppError('fail with AppError');
        } catch (err) {
          next(err);
        }
      })
      .describe({
        responses: {
          500: {
            description: 'error',
            model: 'errorResponse',
          },
        },
      });

    router.get('/errors/failCrash', function (req, res, next) {
      try {
        throw new Error('catastrophe!');
      } catch (err) {
        next(err);
      }
    });

    router.get('/errors/failUnhandledRejection', function (req, res, next) {
      Promise.reject(new Error('Resource not yet loaded!'));
    });

    //async fail
    router
      .get('/errors/asyncfail500', async (req, res, next) => {
        try {
          const neverUsed = await myAsyncFunction();
          res.json({});
        } catch (err) {
          next(err);
        }
      })
      .describe({
        responses: {
          500: {
            description: 'error',
            model: 'errorResponse',
          },
        },
      });

    //async fail - bad request
    router
      .get('/errors/asyncfail400', async (req, res, next) => {
        try {
          const neverUsed = await myAsyncBadRequestFunction();
          res.json({});
        } catch (err) {
          next(err);
        }
      })
      .describe({
        responses: {
          400: {
            description: 'error',
            model: 'errorResponse',
          },
        },
      });
  };

  return {
    registerRoutes,
  };
})();

module.exports = testController;
