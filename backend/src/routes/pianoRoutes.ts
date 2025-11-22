import express, { Router } from "express";
import { asyncHandler } from "../utils/catchAsync";
import * as pianoController from "../controllers/pianoController";

const router: Router = express.Router();

router.route("/setup").post(asyncHandler(pianoController.setup));

export default router;
