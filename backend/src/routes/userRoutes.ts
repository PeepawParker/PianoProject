import express, { Router } from "express";
import * as userController from "../controllers/userController";
import * as authController from "../controllers/authController";
import * as userMiddleware from "../middleware/userMiddleware";
import { asyncHandler } from "../utils/catchAsync";

const router: Router = express.Router();

// This allows for multiple methods to be called from the same path GET, POST, DELETE, etc...
router
  .route("/signup")
  .post(
    asyncHandler(userMiddleware.checkNewUserData),
    asyncHandler(authController.signup)
  );

router.route("/login").post(asyncHandler(authController.login));

router.route("/piano/:userId").get(asyncHandler(userController.getUserPianos));
router
  .route("/piano/:userId/:pianoId")
  .get(asyncHandler(userController.getUserPianoKeys));

export default router;
