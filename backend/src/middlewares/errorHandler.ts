import type { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError.js";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { statusCode, message } = err;

  if (!statusCode) statusCode = 500;
  if (!message) message = "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    status: err.status || "error",
    message,
  });
};

export default errorHandler;
