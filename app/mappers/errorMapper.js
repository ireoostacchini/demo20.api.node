const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const MyCustomError = require('../errors/MyCustomError');
const errorDtoCodes = require('../constants/errorDtoCodes');
const ErrorDto = require('../dto/errorDto');

const errorMapper = (() => {
  modelToDto = (error) => {
    //if we have an ordinary Error, we treat it as a programming error
    //## we hide internal error messages from clients
    let result = new ErrorDto(
      errorDtoCodes.internalServerError,
      500,
      'Internal Server Error'
    );

    if (error instanceof NotFoundError) {
      result.code = errorDtoCodes.notFound;
      result.status = 404;
      result.message = '';

      return result;
    }

    //for a BadRequestError, we let the message show, and blame the input
    if (error instanceof BadRequestError) {
      result.code = errorDtoCodes.badRequest;
      result.status = 400;
      result.message = error.message;
    }

    //for errors derived from BadRequestError, eg MyCustomError, we can opt to override:
    if (error instanceof MyCustomError) {
      result.code = errorDtoCodes.myCustomErrorCode;
      result.message = 'a custom error!';
    }

    return result;
  };

  return {
    modelToDto,
  };
})();

module.exports = errorMapper;
