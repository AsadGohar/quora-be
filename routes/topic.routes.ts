import express from "express";
import * as TopicController from "../controllers/topic.controller";
import errorHandler from "../utils/errorHandler";
import { upload } from "../middlewares/upload";

const router = express.Router();

router.post("/", upload, errorHandler(TopicController.createTopic));
router.get("/", errorHandler(TopicController.getAllTopics));
router.post("/follow", errorHandler(TopicController.followTopic));
router.post("/details", errorHandler(TopicController.getTopicPageData));

export default router;
