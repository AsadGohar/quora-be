import { Request, Response } from "express";
import * as AnswerService from "../services/answer.service";

export const answerQuestion = async (req: Request, res: Response) => {
  const questionId = parseInt(req.body.questionId);
  const userId = parseInt(req.body.userId); 
  const { body } = req.body;

  const result = await AnswerService.answerQuestion(questionId, userId, body);
  res.status(result.code).json(result.info);
};

export const likeQuestion = async (req: Request, res: Response) => {
  const questionId = parseInt(req.params.questionId);
  const userId = 1; // Replace this with the actual user ID (from authentication)

  const result = await AnswerService.likeQuestion(questionId, userId);
  res.status(result.code).json(result.info);
};
