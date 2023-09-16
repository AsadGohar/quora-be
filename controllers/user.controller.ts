import { Request, Response } from "express";
import * as UserService from "../services/user.service";

export const signup = async (req: Request, res: Response) => {
	const result = await UserService.createUser(req.body);
	res.status(result.code).json(result.info);
};

export const login = async (req: Request, res: Response) => {
	const result = await UserService.loginUser(req.body);
	res.status(result.code).json(result.info);
};

export const updateUser = async (req: Request, res: Response) => {
	const result = await UserService.updateUser(req.body);
	res.status(result.code).json(result.info);
};

export const getUserInfo = async (req: Request, res: Response) => {
	const result = await UserService.getAboutInfo(req.body);
	res.status(result.code).json(result.info);
};
