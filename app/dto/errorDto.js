class ErrorDto {
  constructor(code, status, message) {
    this.code = code;
    this.status = status;
    this.message = message;
  }

  //no point using ES6 getters / setters here
}

module.exports = ErrorDto;
