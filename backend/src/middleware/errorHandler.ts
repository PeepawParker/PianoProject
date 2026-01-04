import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";

// Global error handler
// Takes the error that was sent via next() or the error from a middleware/route throwing an exception
const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Checks to see if it can use the AppError properties
  if (error instanceof AppError) {
    console.log("An error has occurred");
    console.log(error.status, error.message, error);

    // Returns the status code and error message to the user on the frontend
    // Doesnt return the entire error message to prevent data leaks
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export default errorHandler;
