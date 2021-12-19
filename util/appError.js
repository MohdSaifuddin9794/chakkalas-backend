class AppError extends Error {
  constructor(message, statusCode, errorObj) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.errorObj = errorObj;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
