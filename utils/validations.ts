import * as yup from "yup";

export const userValidationSchema = yup.object().shape({
	name: yup.string().required("name is required"),
	email: yup.string().email("invalid email").required("email is required"),
	age: yup.number().required("age is required"),
	gender: yup.string().required("gender is required"),
	username: yup.string().required("username is required"),
	password: yup
		.string()
		.trim()
		.min(8, "password too short")
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&*])(?=.{8,})/,
			"password isn't strong enough"
		)
		.required("password is required"),

	profile: yup.string().nullable(),
});

export const userLoginSchema = yup.object().shape({
	email: yup.string().email("invalid email").required("email is required"),
	password: yup.string().required("password is required"),
});
