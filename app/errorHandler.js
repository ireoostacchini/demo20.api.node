//##Handle errors centrally, not within an Express middleware (this is called in app.js too)

//  - typical error handling flow might be: Some module throws an error -> API router catches the error -> it propagates the error to the middleware (e.g. Express, KOA) who is responsible for catching errors -> a centralized error handler is called -> the middleware is being told whether this error is an untrusted error (not operational) so it can restart the app gracefully.
//  - it’s a common, yet wrong, practice to handle errors within Express middleware – doing so will not cover errors that are thrown in non-web interfaces
//https://www.toptal.com/nodejs/node-js-error-handling
//https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/centralizedhandling.md

//## we use only the built-in Error object (or objects that extend it) to increase uniformity and prevent loss of information

//## we distinguish operational vs programmer errors (ie bad requests v bugs)

//The Error object is for bugs / unexpected problems - it causes the application to crash and restart
//AppError - and its descendants, eg BadRequestError, NotFoundError - do not cause the application to crash

const errorHandler = (() => {
  handleError = (err, logger) => {
    //log / notify
    logger.error(err);
  };

  return {
    handleError,
  };
})();

module.exports = errorHandler;
