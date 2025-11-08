import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import * as userModel from "../models/userModels";

// Checks the data the user sent in when signing up, making sure that the data is good to push into the database
interface NewUserBody {
  username: string;
  password: string;
  passwordConfirm: string;
  email: string;
}

// Confirms that the username and email are unique, and also that the password and passwordConfirm match
// If they do it gets sent though to hash the password and upload the user to the database via next()
export async function checkNewUserData(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { username, password, passwordConfirm, email }: NewUserBody = req.body;

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
      new AppError(
        "An account has already been created using this email. Please select a new email, or log into the account that has been created with this email",
        409
      )
    );
  }

  const existingUsername = await userModel.getUserByUsername(username);
  if (existingUsername) {
    return next(
      new AppError(
        "An account has already been created using this username. Please select a enter a new username.",
        409
      )
    );
  }

  next();
}
