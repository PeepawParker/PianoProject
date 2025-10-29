import express, { Router } from "express";
import * as userController from "../controllers/userController";
import * as authController from "../controllers/authController";
import * as userMiddleware from "../middleware/userMiddleware";
import { asyncHandler } from "../utils/catchAsync";

const router: Router = express.Router();

router.get(
  "/login",
  asyncHandler(userMiddleware.checkNewUserData) /*, authController.signup*/
);

export default router;
