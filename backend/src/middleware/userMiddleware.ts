import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import * as userModel from "../models/userModels";

export async function checkNewUserData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const username: string = req.body.username;
  const password: string = req.body.password;
  const passwordConfirm: string = req.body.passwordConfirm;
  const email: string = req.body.email;

  if (password.length < 8) {
    return next(new AppError("Password must be atleast 8 character long", 400));
  }

  if (password !== passwordConfirm) {
    return next(
      new AppError(
        "Your password did not match the password confirm please try again",
        400
      )
    );
  }

  const existingEmail = await userModel.getUserByEmail(email);
  if (existingEmail) {
    return next(
      new AppError("An account has already been createed using this email", 409)
    );
  }

  next();
}
