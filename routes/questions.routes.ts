import express from "express";
import * as QuestionController from "../controllers/question.controller";
import errorHandler from "../utils/errorHandler";

const router = express.Router();

router.get("/", errorHandler(QuestionController.getAllQuestions));
router.post("/", errorHandler(QuestionController.addQuestion));
router.get("/topic/:id", errorHandler(QuestionController.getAllQuestionsByTopic));
router.get("/user/:id", errorHandler(QuestionController.getQuestionsByUserFollowingTopics));

export default router;
