const AppError = require('./AppError');

//custom errors (except NotFound) inherit from AppError
class MyCustomError extends AppError {
  constructor(message) {
    super(message);
  }
}

module.exports = MyCustomError;
