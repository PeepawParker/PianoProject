import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";

// Global error handler
// Takes the error that was sent via next() or the error from a middleware/route throwing an exception
const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("An error has occurred");
  console.log(err.status, err.message, err);

  // Returns the status code and error message to the user on the frontend
  // Doesnt return the entire error message to prevent data leaks
  res.status(err.statusCode || 500).json({
    status: err.status || 500,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
