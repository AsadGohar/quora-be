import express from "express";
import userRoutes from "./user.routes";
import topicRoutes from './topic.routes'
import questionsRoutes from './questions.routes'
import answerRoutes from './answers.routes'

const router = express.Router();

router.use("/users", userRoutes);
router.use("/topics", topicRoutes);
router.use("/questions", questionsRoutes);
router.use("/answers", answerRoutes);
export default router;
