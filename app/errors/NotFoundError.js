const AppError = require('./AppError');

class NotFoundError extends AppError {
  constructor(message) {
    super(message);
  }
}

module.exports = NotFoundError;
