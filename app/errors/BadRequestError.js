const AppError = require('./AppError');

class BadRequestError extends AppError {
  constructor(message) {
    super(message);
  }
}

module.exports = BadRequestError;
