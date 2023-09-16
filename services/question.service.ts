import prisma from "./prisma.service";

const ITEMS_PER_PAGE = 10;

export const addQuestionToTopics = async (data: any) => {
	const { body, topicIds, authorId } = data;
	const createdQuestion = await prisma.question.create({
		data: {
			body,
			authorId,
			QuestionTopic: {
				create: topicIds.map((topicId: any) => ({
					topic: { connect: { id: topicId } },
				})),
			},
		},
		include: { QuestionTopic: true },
	});

	return {
		code: 201,
		info: {
			status: true,
			message: "question added successfully",
			question: createdQuestion,
		},
	};
};

export const getAllQuestions = async () => {
	try {
		const questions = await prisma.question.findMany();

		return {
			code: 200,
			info: {
				status: true,
				message: "Questions retrieved successfully",
				questions,
			},
		};
	} catch (error) {
		console.error("Error getting questions:", error);
		return {
			code: 500,
			info: {
				status: false,
				message: "Failed to get questions",
			},
		};
	}
};

export const getQuestionsByTopicId = async (data: any) => {
	const { id } = data;

	const questions = await prisma.question.findMany({
		where: {
			QuestionTopic: {
				some: {
					id,
				},
			},
		},
	});

	return {
		code: 200,
		info: {
			status: true,
			message: "Questions retrieved successfully",
			questions,
		},
	};
};

export const getQuestionsByUserFollowingTopics = async (data: any) => {
	const { id } = data;
	console.log(id, "id");
	const user = await prisma.user.findUnique({
		where: { id: Number(id) },
		include: { userFollowTopic: { include: { topic: true } } },
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

	const topicIds = user.userFollowTopic.map(
		(followedTopic) => followedTopic.topicId
	);

	const questions = await prisma.question.findMany({
		where: {
			QuestionTopic: {
				some: {
					topicId: { in: topicIds },
				},
			},
		},
		include: {
			answers: {
				include:{
					author:true
				},
				orderBy: {
					likeCount: "desc",
				},
				take: 2,
			},
			author: true,
		},
	});

	for (const question of questions) {
		for (const answer of question.answers) {
			const reactionsCount = await prisma.answerReaction.count({
				where: { answerId: answer.id },
			});
			answer.likeCount = reactionsCount;
		}
	}

	return {
		code: 200,
		info: {
			status: true,
			message: "Questions retrieved successfully",
			questions,
		},
	};
};

export const getQuestionsByTopic = async (topicId: number, page: number) => {
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
		where: { topicId: topicId },
	});

	const skip = (page - 1) * ITEMS_PER_PAGE;
	const questions = await prisma.question.findMany({
		where: { QuestionTopic: { some: { topicId } } },
		include: {
			answers: true,
			QuestionTopic: true,
			author: true,
			QuestionReaction: true,
		},
		orderBy: {
			likeCount: "desc",
		},
		skip,
		take: ITEMS_PER_PAGE,
	});

	return {
		code: 200,
		info: {
			status: true,
			message: "Questions retrieved successfully",
			questions,
			totalFollowers,
		},
	};
};
