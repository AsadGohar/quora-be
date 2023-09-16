import { Request, Response } from "express";
import * as TopicService from "../services/topic.service";

export const createTopic = async (req: Request, res: Response) => {
	const result = await TopicService.createTopic({
		...req.body,
		file: req?.file,
	});
	res.status(result.code).json(result.info);
};

export const followTopic = async (req: Request, res: Response) => {
	const result = await TopicService.followTopic(req.body);
	res.status(result.code).json(result.info);
};

export const getAllTopics = async (req: Request, res: Response) => {
	const result = await TopicService.getAllTopics();
	res.status(result.code).json(result.info);
};

export const getTopicPageData = async (req: Request, res: Response) => {
	const topicId = parseInt(req.body.topicId);
	const page = parseInt(req.body.page) || 1; 
	const result = await TopicService.getTopicPageData({topicId, page});
	res.status(result.code).json(result.info);
};
