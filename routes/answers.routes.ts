import express from "express";
import * as AnswerController from "../controllers/answer.controller";
import errorHandler from "../utils/errorHandler";

const router = express.Router();

router.post("/", errorHandler(AnswerController.answerQuestion));
// router.post("/", errorHandler(AnswerController.likeQuestion));

export default router;
