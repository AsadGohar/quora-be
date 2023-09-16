import { Request, Response } from "express";
import * as QuestionService from "../services/question.service";

export const addQuestion = async (req: Request, res: Response) => {
	const result = await QuestionService.addQuestionToTopics(req.body);
	res.status(result.code).json(result.info);
};

export const getAllQuestions = async (req: Request, res: Response) => {
	const result = await QuestionService.getAllQuestions();
	res.status(result.code).json(result.info);
};

export const getAllQuestionsByTopic = async (req: Request, res: Response) => {
	const result = await QuestionService.getQuestionsByTopicId(req.params);
	res.status(result.code).json(result.info);
};

export const getQuestionsByUserFollowingTopics = async (req: Request, res: Response) => {
	console.log(req.body)
  const result = await QuestionService.getQuestionsByUserFollowingTopics(req.params);
  res.status(result.code).json(result.info);
};

export const getQuestionsByTopic = async (req: Request, res: Response) => {
  const { topicId, page } = req.params;
  const result = await QuestionService.getQuestionsByTopic(parseInt(topicId), parseInt(page));
  res.status(result.code).json(result.info);
};