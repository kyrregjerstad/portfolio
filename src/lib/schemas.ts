import { z } from "zod";

export const contactFormSchema = z.object({
	name: z.string().min(3, "Name must be over 3 characters").max(50, "Name must be under 50 characters").nullish(),
	subject: z
		.string()
		.min(3, "Subject must be over 3 characters")
		.max(50, "Subject must be under 50 characters")
		.nullish(),
	email: z.string().email("Invalid email address"),
	message: z
		.string()
		.min(10, "Message must be over 10 characters")
		.max(500, "Message must be under 500 characters")
		.nullish()
});
export type ContactFormSchema = typeof contactFormSchema;

export const profileSchema = contactFormSchema.pick({ name: true });
export type ProfileSchema = typeof profileSchema;

export const emailSchema = contactFormSchema.pick({ email: true });
export type EmailSchema = typeof emailSchema;

export const messageSchema = contactFormSchema.pick({ message: true });
export type MessageSchema = typeof messageSchema;

export const subjectSchema = contactFormSchema.pick({ subject: true });
export type SubjectSchema = typeof subjectSchema;
