import { uploadImage } from "../utils/cloudinaryUploads";
import prisma from "./prisma.service";

const ITEMS_PER_PAGE = 10;

export const createTopic = async (data: any) => {
	const { title, description, file } = data;
	const existingTopic = await prisma.topic.findUnique({
		where: { title },
	});

	if (existingTopic) {
		return {
			code: 409,
			info: {
				status: false,
				message: "Topic with this name already exists",
			},
		};
	}

	const upload = await uploadImage(file);

	if (upload) {
		const topic = await prisma.topic.create({
			data: {
				title,
				description,
				picture: String(upload),
			},
		});

		return {
			code: 201,
			info: {
				status: true,
				message: "Topic created successfully",
				topic,
			},
		};
	} else {
		return {
			code: 402,
			info: {
				status: false,
				message: "Pic Upload Failed",
			},
		};
	}
};

export const followTopic = async (data: any) => {
	const { userId, topicId } = data;
	const user = await prisma.user.findUnique({
		where: { id: Number(userId) },
		include: { userFollowTopic: true },
	});
	if (!user) {
		return {
			code: 404,
			info: {
				status: false,
				message: "User not found",
			},
		};
	}
	const topic = await prisma.topic.findUnique({
		where: { id: Number(topicId) },
	});

	if (!topic) {
		return {
			code: 404,
			info: {
				status: false,
				message: "Topic not found",
			},
		};
	}
	const isFollowing = user.userFollowTopic.some(
		(followedTopic) => followedTopic.topicId === topicId
	);
	if (isFollowing) {
		return {
			code: 409,
			info: {
				status: false,
				message: "already following this topic",
			},
		};
	}
	await prisma.userFollowTopic.create({
		data: {
			type: "follow",
			userId:Number(userId),
			topicId:Number(topicId),
		},
	});
	return {
		code: 201,
		info: {
			status: true,
			message: "Following the topic successfully",
		},
	};
};

export const getAllTopics = async () => {
	const topics = await prisma.topic.findMany();
	return {
		code: 200,
		info: {
			status: true,
			message: "Topics retrieved successfully",
			topics,
		},
	};
};

export const getTopicPageData = async (data: any) => {
	const { topicId, page } = data;
	try {
		const topic = await prisma.topic.findUnique({
			where: { id: topicId },
		});

		if (!topic) {
			return {
				code: 404,
				info: {
					status: false,
					message: "Topic not found",
				},
			};
		}

		const totalFollowers = await prisma.userFollowTopic.count({
			where: { topicId },
		});

		const skip = (page - 1) * ITEMS_PER_PAGE;
		const questions = await prisma.question.findMany({
			where: { QuestionTopic: { some: { topicId } } },
			include: {
				answers: true,
				QuestionTopic: true,
				author: true,
			},
			orderBy: { likeCount: "desc" },
			skip,
			take: ITEMS_PER_PAGE,
		});

		return {
			code: 200,
			info: {
				status: true,
				message: "Topic page data retrieved successfully",
				topic,
				totalFollowers,
				questions,
			},
		};
	} catch (error) {
		console.error("Error getting topic page data:", error);
		return {
			code: 500,
			info: {
				status: false,
				message: "Failed to get topic page data",
			},
		};
	}
};
