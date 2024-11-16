import { z } from 'zod';

export const commentFormSchema = z.object({
	displayName: z.string().min(1, { message: 'Display Name is required' }).max(50, {
		message: 'Display Name must be less than 50 characters',
	}),
	content: z.string().min(2, { message: 'Comment is required' }).max(2000, {
		message: 'Comment must be less than 2000 characters',
	}),
	botCheck: z.boolean().optional(),
});

export type CommentForm = typeof commentFormSchema;
