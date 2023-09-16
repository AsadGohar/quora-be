import prisma from "./prisma.service";

export const answerQuestion = async (
	questionId: number,
	userId: number,
	body: string
) => {
	const question = await prisma.question.findUnique({
		where: { id: questionId },
	});

	if (!question) {
		return {
			code: 404,
			info: {
				status: false,
				message: "Question not found",
			},
		};
	}

	const answer = await prisma.answer.create({
		data: {
			body,
			question: { connect: { id: questionId } },
			author: { connect: { id: userId } },
		},
	});

	return {
		code: 201,
		info: {
			status: true,
			message: "Answer Added",
			answer,
		},
	};
};

export const likeQuestion = async (questionId: number, userId: number) => {   
	try {
		// Check if the question exists
		const question = await prisma.question.findUnique({
			where: { id: questionId },
		});

		if (!question) {
			return {
				code: 404,
				info: {
					status: false,
					message: "Question not found",
				},
			};
		}

		// Check if the user has already liked the question
		const existingLike = await prisma.questionReaction.findFirst({
			where: { questionId, userId, type: "like" },
		});

		if (existingLike) {
			return {
				code: 409,
				info: {
					status: false,
					message: "You have already liked this question",
				},
			};
		}

		// Create the like reaction
		await prisma.questionReaction.create({
			data: {
				type: "like",
				user: { connect: { id: userId } },
				question: { connect: { id: questionId } },
			},
		});

		// Increment the likeCount in the question
		const updatedQuestion = await prisma.question.update({
			where: { id: questionId },
			data: { likeCount: { increment: 1 } },
		});

		return {
			code: 200,
			info: {
				status: true,
				message: "Question liked successfully",
				question: updatedQuestion,
			},
		};
	} catch (error) {
		console.error("Error liking question:", error);
		return {
			code: 500,
			info: {
				status: false,
				message: "Failed to like the question",
			},
		};
	}
};
