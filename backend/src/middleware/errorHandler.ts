import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("An error has occurred");
  console.log(err.status, err.message, err);

  res.status(err.statusCode || 500).json({
    status: err.status || 500,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
