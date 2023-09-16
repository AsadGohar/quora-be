import { comparePassword, createToken, hashPassword } from "../utils/auth";
import prisma from "./prisma.service";

export const createUser = async (data: any) => {
	const { email, name, password, gender, age, username } = data;
	const checkEmailUser = await prisma.user.findUnique({
		where: {
			email,
		},
	});
	if (checkEmailUser) {
		return {
			code: 409,
			info: {
				status: false,
				message: "email already registered",
			},
		};
	}
	const hashedPassword = await hashPassword(password);
	const user = await prisma.user.create({
		data: {
			email,
			name,
			password: hashedPassword,
			profile: "",
			gender,
			age,
			username,
		},
	});
	if (user) {
		const accessToken = createToken(String(user.id));
		return {
			code: 201,
			info: {
				status: true,
				message: "created user",
				user,
				accessToken,
			},
		};
	} else {
		return {
			code: 201,
			info: {
				status: false,
				message: "failed to create user",
			},
		};
	}
};

export const loginUser = async (data: any) => {
	const { email, password, gender, age, username } = data;
	const user = await prisma.user.findUnique({
		where: {
			email,
		},
	});
	if (user) {
		const isMatchPassword = await comparePassword(password, user.password);
		if (isMatchPassword) {
			const accessToken = createToken(String(user.id));
			return {
				code: 201,
				info: {
					status: true,
					message: "user found successfully",
					user,
					accessToken,
				},
			};
		}
	}
	return {
		code: 404,
		info: {
			status: false,
			message: "user not found",
		},
	};
};

export const updateUser = async (data: any) => {
	const { name, age, gender, profile, id } = data;
	const updatedUser = await prisma.user.update({
		where: { id },
		data: {
			name,
			age,
			gender,
			profile,
		},
	});

	if (updatedUser) {
		return {
			code: 200,
			info: {
				status: true,
				message: "user updated successfully",
				user: updatedUser,
			},
		};
	} else {
		return {
			code: 404,
			info: {
				status: false,
				message: "user not found",
			},
		};
	}
};

export const getAboutInfo = async (data: any) => {
	const { userId } = data;
	const user = await prisma.user.findUnique({
		where: { id: userId },
		include: {
			userFollowTopic: true,
			questions: true,
			answers: {
				include: { question: true },
			},
		},
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

	return {
		code: 200,
		info: {
			status: true,
			message: "User information retrieved successfully",
			user,
		},
	};
};
