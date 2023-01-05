class CustomError extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message;
    this.statusCode = statusCode;

    //Adds the error stack to errObj.stack
    //stack contains precise location of error.
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;
