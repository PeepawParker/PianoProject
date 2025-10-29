import { Request, Response, NextFunction } from "express";

// Catches an error that happens within an async function calling next(error) so it goes through the global error handler
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    // .catch(next) is equivalent to .catch((err) => next(err));
    // When you call .catch() and pass a function as the argument it calls that function with the error as its argument
    fn(req, res, next).catch(next);
  };
