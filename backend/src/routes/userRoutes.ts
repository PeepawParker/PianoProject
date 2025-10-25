import express, { Router } from "express";
import * as UserController from "../controllers/userController";

const router: Router = express.Router();

router.get("/login", UserController.login);

export default router;
