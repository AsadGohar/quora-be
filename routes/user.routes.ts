import express from "express";
import * as UserController from "../controllers/user.controller";
import errorHandler from "../utils/errorHandler";
import validate from "../middlewares/validate";
import { userValidationSchema, userLoginSchema } from "../utils/validations";

const router = express.Router();

router.post(
	"/signup",
	validate(userValidationSchema),
	errorHandler(UserController.signup)
);
router.post(
	"/login",
	validate(userLoginSchema),
	errorHandler(UserController.login)
);

export default router;