import express, { Router } from "express";
import * as userController from "../controllers/userController";
import * as authController from "../controllers/authController";
import * as userMiddleware from "../middleware/userMiddleware";

const router: Router = express.Router();

router.get("/login" /*userMiddleware.checkNewUserData, authController.signup*/);

export default router;
